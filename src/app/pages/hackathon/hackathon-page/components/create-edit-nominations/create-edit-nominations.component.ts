import {Component, effect, inject, input} from '@angular/core';
import {IHackathonDto} from "../../../../../core/models/hackathonDto";
import {HackathonService} from "../../../../../core/services/hackathon.service";
import {InputErrorComponent} from "../../../../../shared/ui-components/input-error/input-error.component";
import {PaginatorModule} from "primeng/paginator";
import {FormArray, FormBuilder, ReactiveFormsModule, Validators, FormControl} from "@angular/forms";
import {UiButtonComponent} from "../../../../../shared/ui-components/ui-button/ui-button.component";
import {from, concatMap, debounceTime, mergeMap} from "rxjs";
import {IHackathonNomination} from "../../../../../core/models/hackathons";
import {SuccessModalComponent} from "../../../../../shared/modals/success-modal/success-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {AchievementsService} from "../../../../../core/services/achievements.service";

@Component({
  selector: 'app-create-edit-nominations',
  standalone: true,
  imports: [
    InputErrorComponent,
    PaginatorModule,
    ReactiveFormsModule,
    UiButtonComponent,
  ],
  templateUrl: './create-edit-nominations.component.html',
  styleUrl: './create-edit-nominations.component.scss'
})
export class CreateEditNominationsComponent {
  hackathon = input.required<IHackathonDto>()
  private hackathonService = inject(HackathonService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private achievementsService = inject(AchievementsService);

  public form = this.fb.array([
    this.fb.group({
      id: [null as any],
      name: ['', Validators.required],
      description: ['']
    })
  ]);

  private nominations: IHackathonNomination[] = [];
  private isEdit: boolean = false;

  constructor() {
    effect(() => {
      this.removeItem(0);
      this.setNominationsData();
    });
  }

  get controls() {
    return (this.form as FormArray).controls as FormControl[];
  }

  setNominationsData() {
    const hackathonId = this.hackathon().id;
    if (hackathonId) {
      this.hackathonService.getHackathonNominations(hackathonId).subscribe(result => {
        if (result.length) {
          this.nominations = result;
          this.isEdit = true;
          result.forEach((nomination: IHackathonNomination) => {
            this.addItem(nomination.name, nomination.description)
          })
        } else {
          this.addItem('Первое место');
          this.addItem('Второе место');
          this.addItem('Третье место');
        }
      })
    }
  }

  addItem(name: string, description?: string, id?: number) {
    this.form.push(this.fb.group({
      id: [id],
      name: [name, Validators.required],
      description: [description ? description : '', [Validators.required, Validators.min(1)]]
    }));
  }

  submitForm() {
    // const formData = new FormData();
    // formData.append('file', this.form.value.image, this.form.value.image.name);

    // this.achievementsService.addAchievementImage(formData).pipe(
    //   mergeMap(data => {
    //     const addData = {
    //       title: this.hackathon().title,
    //       image: data.message,
    //       description: this.hackathon().description,
    //     }
    //     return this.achievementsService.addAchievement(addData)
    //   })
    // ).subscribe(result => {})


    if (this.form.valid) {
      if (!this.isEdit) {
        this.saveNominations(this.form.value);
      } else {

        const oldItems: any[] = this.form.value.filter((item, index) => {
          if (this.nominations[index]) {
            return item.id !== this.nominations[index].id;
          } else {
            return false;
          }
        });

        let updatedItems: IHackathonNomination[] = [];

        oldItems.forEach((item, index) => {
          delete item.id;
          const itemData = {
            ...this.nominations[index],
            description: item.description,
            name: item.name,
          };
          updatedItems.push(itemData);
        })

        from(updatedItems).pipe(
          concatMap(item => this.hackathonService.updateHackathonNomination(item)),
          debounceTime(500),

          // mergeMap(data => {
          //   const addData = {
          //     title: data.title,
          //     image: data.message,
          //     description: this.hackathon().description,
          //   }
          //   return this.achievementsService.addAchievement(addData)
          // })
        ).subscribe(
          result => {
            this.openSuccessModal();
          }
        );

        if (this.nominations.length !== this.form.value.length) {
          const newItems = this.form.value.filter((item, index) => {
            if (this.nominations[index]) {
              return item.id === this.nominations[index].id;
            } else {
              return true;
            }
          });
          this.saveNominations(newItems);
        }
      }
    }
  }

  saveNominations(nominations: any[]) {
    let data: any[] = [];
    nominations.forEach((item, index) => {
      delete item.id;
      const place = this.nominations.length ? Number(this.nominations[this.nominations.length-1].place) : index;
      const itemData = {
        ...item,
        hackathon: this.hackathon(),
        place: place+1,
      };
      data.push(itemData);
      this.nominations.push(itemData);
    })

    from(data).pipe(
      concatMap(item => this.hackathonService.addHackathonNomination(item)),
      debounceTime(500)
    ).subscribe(
      result => {
        if (result) {
          this.openSuccessModal();
        }
      }
    )
  }

  openSuccessModal() {
    let dialogRef = this.dialog.open(SuccessModalComponent, {
      height: '250px',
      width: '450px',
      data: {title: '', text: 'Номинации были успешно сохранены'},
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    })
  }

  removeItem(index: number) {
    this.form.removeAt(index);
  }

  closeNominationsForm() {
    this.hackathonService.page = 'home'
  }
}
