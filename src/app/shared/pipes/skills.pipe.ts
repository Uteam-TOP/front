import { Pipe, PipeTransform } from '@angular/core';
import {EnSkillColor, EnSkillLevel, EnSkillLvlShort} from "../../core/models/resumeVacancyDto";

@Pipe({
  name: 'skills',
  standalone: true
})
export class SkillsPipe implements PipeTransform {

  transform(skillLevel?: number, type: 'color' | 'name' | 'short' = 'name'): string {
    if (skillLevel) {
      if (type === 'short') {
        return EnSkillLvlShort[skillLevel];
      }
      if (type === 'name') {
        return EnSkillLevel[skillLevel];
      }
      if (type === 'color') {
        const lvl = EnSkillLevel[skillLevel];
        return EnSkillColor[lvl as keyof typeof EnSkillColor];
      }
    }
    return '';
  }

}
