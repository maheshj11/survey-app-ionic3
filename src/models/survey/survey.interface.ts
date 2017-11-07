export interface Survey {
    title: string;
    description?: string;
    type: string;
    surveyDate?: Date, 
    surveyTime?: string,
    optionsData: any[],
    commentsData?: any[],
    votesData?: any[],
    surveyVotes?: number;
    $key?: string;
    id: string;
    votedOption?: boolean;
    disabled?: boolean;
}