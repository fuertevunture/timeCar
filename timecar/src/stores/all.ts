import {create} from 'zustand';

interface All {
    no: string;
    creatAt: string;
    time: string;
    origin: string;
    originInfo: string;
    address: string;
    score: string;
    isHubei: string;
    school: string;
    schoolType: string;
    gender: string;
    grade: string;
    subjectType: string;
    subjectFuture: string;
    changeSubject: string;
    changeWhich: string;
    changeWhichIndustry: string;
    workWay: string;
    companyFor: string;
    workFor: string;
    howMuch: string;
    where: string;
    whichLevel: string;
    isCreat: string;
    howStrong: string;
    isNervous: string;
    pressure: string;
    effect: string;
    confidence: string;
    advise: string;
    feedback: string;
    email: string;
    phone: string;
    /** 定位失败时用户手动填写的当前城市（会话内临时字段，可与问卷数据合并保存） */
    currentAddress?: string;
}

const useAllStore = create((set) => ({
    all: {} as Partial<All>,
    setAll: (newALl: Partial<All>) => set((state: { all: Partial<All> }) => ({
        all: {...state.all, ...newALl,},
    }))
}))

export default useAllStore;