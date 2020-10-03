import { Component, OnInit, Input , Inject, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  date: string;
  authorName: string;
  comments: string;
  errMess: String;
  dishcopy: Dish;

  @ViewChild('commentform') commentFormDirective;
  formErrors = {
    name: '',
    comments: '',
  };

  validationMessages = {
    name: {
      required: 'Name is required.',
      minlength: 'Name must be at least 2 characters long.',
      maxlength: 'Name cannot be more than 30 characters long.',
    },
    comments: {
      required: 'Comment is required.',
      minlength: 'Comment must be at least 10 characters long.',
      maxlength: 'Comment cannot be more than 200 characters long.',
    },
  };

  constructor(
    private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    public fb: FormBuilder,
    @Inject('BaseURL') private baseURL
  ) {
    this.createCommentForm();
  }

  ngOnInit() {
    //Using observable to fetch the clicked dish from the getDish() method in dish Service by passing id obtained using activatedRoute.
    this.dishservice.getDishIds().subscribe(
      (dishIds) => (this.dishIds = dishIds),
      (errmess) => (this.errMess = <any>errmess)
    );
    this.route.params.pipe( switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe((dish) => {
        this.dish = dish;
        this.dishcopy = dish;
        this.setPrevNext(dish.id);
      });

    // const id = this.route.snapshot.params['id'];
    // this.dishservice.getDish(id).subscribe(dish => this.dish = dish);
  }

  //Comment Form Submission function
  createCommentForm() {
    this.commentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      comment: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      rating: ['5'],
    });

    this.commentForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  //SETTING NEXT AND PREVIOUS DISH
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }

  goBack(): void {
    this.location.back();
  }
  onSubmit() {
    //ASSIGNING VALUES OF COMMENT FORM TO THE JSON OBJECT COMMENT WHICH IS TO BE PUSHED
    this.comment = this.commentForm.value;
   
    this.comment.date = new Date().toISOString();

    //Pushing new Json object into comments array of dishes
    this.dishcopy.comments.push(this.comment);

    
    this.dishservice.putDish(this.dishcopy).subscribe(
      (dish) => {
        this.dish = dish;
        this.dishcopy = dish;
      },
      (errmess) => {
        this.dish = null;
        this.dishcopy = null;
        this.errMess = <any>errmess;
      }
    );
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      name: '',
      comments: '',
      rating: 5,
    });
  }
}
