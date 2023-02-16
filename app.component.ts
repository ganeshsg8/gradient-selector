import { Component, ElementRef, OnInit, ViewChild, Renderer2, ViewChildren, QueryList, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChildren("pinHead") pinsHead: QueryList<ElementRef> | undefined;
  @ViewChildren("pinBody") pinsBody: QueryList<ElementRef> | undefined;
  @ViewChildren("inputRange") inputRange: QueryList<ElementRef> | undefined;
  @ViewChild("gradientBox") gradientBox : ElementRef | undefined;

  title = 'color-gradient';
  gradientColors: Array<string> = ['rgba(255,0,0,1)', 'rgba(255,255,0,1)', 'rgba(0,255,0,1)'];
  initialValues: Array<number> = [0, 50, 100];
  min: number = 0;
  max: number = 100;
  buildIssue:boolean = false;
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {

  }
  ngAfterViewInit(): void {
    this.initialValues.forEach((val: number, index: number) => {
      let element = this.inputRange?.get(index) as ElementRef;
      if (element) {
        element.nativeElement.value = val;
      }
      this.changePinLocation(index, val);
    })

    this.gradientColors.forEach((color: string, index: number) => {
      let pinBody = this.pinsBody?.get(index) as ElementRef;
      this.renderer.setStyle(pinBody.nativeElement, 'background', color)
    })
  }

  ngOnInit(): void {

  }
  valueChange(event: any, currentIndex: number) {
    let currentValue: number = parseInt(event.target.value);
    let beforeVal: number = this.initialValues[currentIndex - 1] ? this.initialValues[currentIndex - 1] : this.min
    let nextVal: number = this.initialValues[currentIndex + 1] ? this.initialValues[currentIndex + 1] : this.max;
    let rangeInput = this.inputRange?.get(currentIndex) as ElementRef;

    if (currentValue <= beforeVal) {
      if(beforeVal == this.min){
        this.initialValues[currentIndex] = currentValue;
        this.changePinLocation(currentIndex, event.target.value);  
      }else{
        rangeInput.nativeElement.value = this.initialValues[currentIndex];
      }
    } else if(currentValue >= nextVal){
      if(nextVal == this.max){
        this.initialValues[currentIndex] = currentValue;
        this.changePinLocation(currentIndex, event.target.value);
      }else{
        rangeInput.nativeElement.value = this.initialValues[currentIndex];
      }
    }else {
      this.initialValues[currentIndex] = currentValue;
      this.changePinLocation(currentIndex, event.target.value);
    }

  }

  changePinLocation(index: number, value: number) {
    let pinHead = this.pinsHead?.get(index) as ElementRef;
    let pinBody = this.pinsBody?.get(index) as ElementRef;
    this.renderer.setStyle(pinHead.nativeElement, 'left', value + '%')
    this.renderer.setStyle(pinBody.nativeElement, 'left', value + '%');
    // console.log("this.gradientBox?.nativeElement ",this.gradientBox?.nativeElement);
    this.setGradientColor();
  }
  setGradientColor(){
    if(this.gradientColors.length ==1){
      this.buildIssue = true
      alert("cannot build gradient");
    }else if(this.gradientColors.length >1){
      let gradientTxt = 'linear-gradient(90deg,';
      this.gradientColors.forEach((colorCode:any,i:number)=>{
        gradientTxt += ' '+colorCode+' '+this.initialValues[i]+'%,'; 
      })
      gradientTxt = gradientTxt.substr(0,gradientTxt.length-1);
      gradientTxt += ')';
      // console.log(gradientTxt);
      this.renderer.setStyle(this.gradientBox?.nativeElement,'background',gradientTxt);
    }
    // this.renderer.setStyle(
    //   this.gradientBox?.nativeElement,'background','linear-gradient(90deg, rgba(255,0,0,1) '+this.initialValues[0]+'%, rgba(255,255,0,1) '+this.initialValues[1]+'%, rgba(0,255,0,1) '+this.initialValues[2]+'%)');
  }
}
