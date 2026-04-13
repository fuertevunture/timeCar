const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ======================== 配置区 ========================
const DB_PATH = './time.db';          // 数据库文件路径
const EXCEL_PATH = './timecar.xlsx';  // Excel 文件路径
const TABLE_NAME = 'survey_data';     // 你要创建的表名（可自定义）
// ========================================================

// 辅助函数：将 Excel 中的特殊空值转换为真正的 NULL
function sanitizeValue(value) {
    if (value === undefined || value === null) return null;
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '' || trimmed === '(空)' || trimmed === 'NULL' || trimmed === 'null') {
            return null;
        }
        return value;  // 保留其他字符串原样
    }
    return value;
}

// 主函数
async function importExcelToSQLite() {
    const db = new sqlite3.Database(DB_PATH);

    try {
        // 1. 读取 Excel 文件
        console.log('正在读取 Excel 文件...');
        const workbook = XLSX.readFile(EXCEL_PATH);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // 转换为 JSON，header: 1 表示第一行为列名
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (rows.length === 0) {
            console.log('Excel 文件中没有数据行，退出。');
            db.close();
            return;
        }

        // 2. 获取所有列名（表头）
        const columns = Object.keys(rows[0]);
        console.log(`检测到 ${columns.length} 列: ${columns.join(', ')}`);

        // 3. 动态创建表（所有列都使用 TEXT 类型，避免转换问题）
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ${columns.map(col => `"${col}" TEXT`).join(',\n                ')}
            )
        `;
        console.log('创建表 SQL:', createTableSQL);

        await new Promise((resolve, reject) => {
            db.run(createTableSQL, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log(`表 "${TABLE_NAME}" 已就绪。`);

        // 4. 准备插入语句（使用占位符）
        const placeholders = columns.map(() => '?').join(',');
        const insertSQL = `INSERT INTO ${TABLE_NAME} (${columns.map(col => `"${col}"`).join(',')}) VALUES (${placeholders})`;

        // 5. 批量插入数据（事务）
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");
                const stmt = db.prepare(insertSQL);

                let successCount = 0;
                let errorCount = 0;

                for (const row of rows) {
                    // 提取每列的值，并清洗空值
                    const values = columns.map(col => sanitizeValue(row[col]));
                    stmt.run(values, (err) => {
                        if (err) {
                            console.error('插入失败:', err.message);
                            errorCount++;
                        } else {
                            successCount++;
                        }
                    });
                }

                stmt.finalize();
                db.run("COMMIT", (err) => {
                    if (err) reject(err);
                    else {
                        console.log(`导入完成：成功 ${successCount} 条，失败 ${errorCount} 条`);
                        resolve();
                    }
                });
            });
        });

    } catch (err) {
        console.error('发生错误:', err.message);
    } finally {
        db.close();
        console.log('数据库连接已关闭。');
    }
}

// 执行导入
importExcelToSQLite();