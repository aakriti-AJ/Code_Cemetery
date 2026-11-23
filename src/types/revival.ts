import type { Timestamp } from 'firebase/firestore';
export type ProposalStatus='PENDING'|'ACCEPTED'|'REJECTED';
export interface ProposalInput {message:string;skills:string[];proposedPlan:string}
export interface RevivalProposal extends ProposalInput {id:string;projectId:string;ownerId:string;applicantId:string;applicantName:string;status:ProposalStatus;createdAt:Timestamp;updatedAt:Timestamp}
export interface Contributor {userId:string;name:string;role:string;proposalId:string;joinedAt:Timestamp}
export interface ProjectTask {id:string;title:string;completed:boolean;createdBy:string;createdAt:Timestamp;updatedAt:Timestamp}
export interface ProjectComment {id:string;authorId:string;authorName:string;message:string;createdAt:Timestamp}
export interface AppNotification {id:string;userId:string;type:string;message:string;relatedProjectId:string;read:boolean;createdAt:Timestamp}
