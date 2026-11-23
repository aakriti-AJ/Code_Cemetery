import {z} from 'zod';
export const revivalSchema=z.object({message:z.string().trim().min(20,'Write at least 20 characters about yourself.').max(1500),skills:z.array(z.string().trim().min(2).max(60)).min(1,'Add a technical skill.').max(15),proposedPlan:z.string().trim().min(30,'Explain your plan in at least 30 characters.').max(4000)});
