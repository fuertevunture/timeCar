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
}

const useAllStore = create((set) => ({
    all: {},
    setAll: (newALl: All) => set((state: any) => ({
        all: {...state.all, ...newALl,},
    }))
}))

export default useAllStore;