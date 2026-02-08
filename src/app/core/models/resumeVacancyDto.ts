import {ITagDto, TagDto} from "./tagDto";
import {IProjectDto} from "./projectDto";
import {UserDto} from "./userDto";

export interface resumeVacancyDto {
  id: number;
  banReason?: string;
  creationDate: number;
  details?: string;
  employment?: string;
  minPayment: number;
  motivations: ITagDto[];
  profession: ITagDto;
  skills: ITagDto[];
  projectDto: IProjectDto;
  title: string;
  type: cardType;
  user: UserDto;
  visibility: string;
}

export enum cardType {
  Resume = "RESUME",
  Vacancy = "VACANCY"
}

export enum EnSkillLevel {
  Junior = 1,
  Middle = 2,
  Senior = 3
}

export enum EnSkillLvlShort {
  Jun = 1,
  Mid = 2,
  Snr = 3,
}

export enum EnSkillColor {
  Junior = '#50B229',
  Middle = '#FAD305',
  Senior = '#EE5354'
}

