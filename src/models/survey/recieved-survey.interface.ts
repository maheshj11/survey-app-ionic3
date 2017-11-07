export interface RecievedSurvey {

    $key?: string;
    fromId?:string;
    fromKey?: string;
    title?: string;
    description?: string;
    didVote?: boolean;
    dataVoted?: any[];
    commentsSurveyKey?:string;
    commentsArray?:any[];
    votedUserName: any;
}