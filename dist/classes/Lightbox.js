export default class Lightbox {
    constructor() {

        this.body = document.querySelector('body');

        // Элементы из блока с превью
        this.mainContainer = document.querySelector('.unf-masonry');
        this.imgCollection = document.querySelectorAll('.unf-masonry__item a');

        // Элементы модального окна
        this.rightButton = document.querySelector('#right');
        this.closeButton = document.querySelector('#close');
        this.leftButton = document.querySelector('#left');

        this.sliderLine = document.querySelector('.modal__slider-line');
        this.modal = document.querySelector('.modal');
        this.isModalBuilded = false;
        this.slideCollection = [];

        window.addEventListener("load", () => this.modalInit());
    }

    modalInit() {

        this.clickedElemNum = 0;
        this.imgCollection.forEach((elem, i) => { elem.setAttribute('data-num', i) })
        this.mainContainer.addEventListener('click', (event) => {
            event.preventDefault();
            let clickedElemNum = (event.composedPath().find((item) => item.nodeName == 'A'));
            this.clickedElemNum = clickedElemNum ? Number(clickedElemNum.getAttribute('data-num')) : undefined;
            if (this.clickedElemNum) {
                this.body.style.overflow = 'hidden';
                this.modal.classList.add('modal_visible');
                if (!this.isModalBuilded) { this.modalBuild() };

                this.slide()
            }
        })
    }

    modalBuild() {
        console.log('Модальное окно запущено')

        this.modalCenterWidth = this.modal.clientWidth

        // Кнопки модального окна
        this.leftButton.addEventListener('click', (event) => {
            this.clickedElemNum--;
            this.slide()
        })

        this.rightButton.addEventListener('click', (event) => {
            this.clickedElemNum++;
            this.slide()
        })

        this.closeButton.addEventListener('click', (event) => {
            this.body.style.removeProperty('overflow');
            this.modal.classList.remove('modal_visible')

        })

        this.isModalBuilded = true;
        this.imgLineBuild()
        this.swipeExtension();
    }

    imgLineBuild() {
        for (let i = 0; i < this.imgCollection.length; i++) {
            let imageUrl = this.imgCollection[i].getAttribute('href')
            let imageCaption = this.imgCollection[i].querySelector('img').getAttribute('data-caption')
            let img = document.createElement('img');
            img.src = '';
            img.setAttribute('data-src', imageUrl)
            let slide = document.createElement('div');
            slide.classList.add('modal__slide')
            slide.innerHTML = `
            <div class="modal__slider-container">
            <div class="modal__footer">
                <div class="modal__caption"> ${imageCaption ? imageCaption : ''}
                </div>
                <div class="modal__img-data">
                    <div class="img-data">
                        <div class="img-data__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path
                                    d="M511.1 63.1v287.1c0 35.25-28.75 63.1-64 63.1h-144l-124.9 93.68c-7.875 5.75-19.12 .0497-19.12-9.7v-83.98h-96c-35.25 0-64-28.75-64-63.1V63.1c0-35.25 28.75-63.1 64-63.1h384C483.2 0 511.1 28.75 511.1 63.1z" />
                            </svg>
                        </div>
                        <div class="img-data__caption">123</div>
                    </div>
                </div>
            </div>
        </div>
            
            `
            slide.querySelector('.modal__slider-container').prepend(img)

            img.onload = () => {
                let imgOriginalHeight = img.clientHeight
                let imgOriginalWidth = img.clientWidth
                img.classList.add('modal__image')
                slide.querySelector('.modal__slider-container').style.width = img.clientHeight * imgOriginalWidth / imgOriginalHeight + 'px';
            }
            slide.classList.add('modal__slide_loading')
            let preloader = document.createElement('div');
            preloader.classList.add('preloader')
            preloader.innerHTML = `<?xml version="1.0" encoding="utf-8"?>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block; shape-rendering: auto;" width="44px" height="44px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <path d="M10 50A40 40 0 0 0 90 50A40 43.5 0 0 1 10 50" fill="#939393" stroke="none">
              <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51.75;360 50 51.75"></animateTransform>
            </path>
            </svg>`
            slide.append(preloader);
            this.sliderLine.append(slide);
            this.slideCollection.push(slide);
        }
        console.log(this.slideCollection)
        this.slide();
    }

    slide() {
        this.sliderLine.style.left = -this.clickedElemNum * this.modalCenterWidth + 'px';
        this.slideLoad();
    }

    slideLoad() {
        let loadingSlides = [];
        if (this.slideCollection[this.clickedElemNum]) loadingSlides.push(this.slideCollection[this.clickedElemNum]);
        if (this.slideCollection[this.clickedElemNum + 1]) loadingSlides.push(this.slideCollection[this.clickedElemNum + 1]);
        if (this.slideCollection[this.clickedElemNum - 1]) loadingSlides.push(this.slideCollection[this.clickedElemNum - 1]);

        loadingSlides.forEach((slide) => {
            if (slide.classList.contains('modal__slide_loading')) {
                let img = slide.querySelector('img')
                img.setAttribute('src', img.getAttribute('data-src'))
                img.addEventListener('load', () => { 
                    
                    slide.classList.remove('modal__slide_loading') 
                    img.removeAttribute('data-src')
                    slide.querySelector('.preloader').remove();
                })


            }
        })
    }

        swipeExtension() {
            let startPoint
            let endPoint
            let pathLength
            let startLine
            this.sliderLine.addEventListener('touchstart', (event) => {
                this.sliderLine.style.transition = 'none'
                startPoint = 0
                endPoint = 0
                pathLength = 0
                startLine = this.sliderLine.offsetLeft;
                startPoint = event.touches[0].clientX;
                console.log(startPoint)
            })
            this.sliderLine.addEventListener('touchmove', (event) => {
    
                endPoint = event.touches[0].clientX;
                this.sliderLine.style.left = startLine + (endPoint - startPoint) + 'px';
                pathLength = startPoint - endPoint;
                console.log(pathLength);
            })
            this.sliderLine.addEventListener('touchend', (event) => {
                this.sliderLine.style.transition = 'all 0.4s ease-out 0s';
                if (pathLength > (this.modal.clientWidth / 4)) {
                    this.clickedElemNum++;
                    this.slide();
                } else if (pathLength < -(this.modal.clientWidth / 4)) {
                    this.clickedElemNum--;
                    this.slide();
    
                } else {
                    this.slide();
                }
    
    
            })
            
        }
    











    /*    modalInit() {
            
            
            let imgCollections = document.querySelectorAll('.unf-masonry__item a');
            imgCollections.forEach((elem, i) => { elem.setAttribute('data-num', i) })
            mainContainer.addEventListener('click', (event) => {
                event.preventDefault();
                document.querySelector('body').style.overflow = 'hidden';
                
                let clickedElemNum = (event.composedPath().find((item) => item.nodeName == 'A'));
                clickedElemNum = clickedElemNum ? clickedElemNum.getAttribute('data-num') : false
                clickedElemNum ? this.modalBuild(clickedElemNum) : false
               // if (clickedElemNum) 
                
            })
        }
    
        modalBuild(elemNum) {
            console.log(elemNum)
            let modal = document.querySelector('.modal');
            modal.classList.add('modal_visible');
    
            // Кнопки модального окна
            let clickableAreas =  document.querySelectorAll('.modal__clickable');
            clickableAreas.forEach((element)=>{
                console.log(element.classList)
                element.addEventListener('click', (event)=> {
                    event.preventDefault();
                    let list = event.currentTarget.classList;
                if (list.contains('modal__clickable_left')) slide(-1);
                if (list.contains('modal__clickable_right')) slide(+1);
                if (list.contains('modal__clickable_close')) {modal.classList.remove('modal_visible')
                document.querySelector('body').removeAttribute('style');
            };
                
                   
               //     event.find('modal__clickable')
                    
                })
            })
    
            
    
            let rightButton =  document.querySelector('.modal__clickable_right');
            let closeButton =  document.querySelector('.modal__close');
    
            let imgCollection = document.querySelectorAll('.unf-masonry__item a');
            let modalCenter = document.querySelector('.modal__column_center');
            let modalCenterWidth = modalCenter.clientWidth
            let imgPlace = document.querySelector('.modal__image-container')
            
    
            for (let i = 0; i < imgCollection.length; i++) {
                let imageUrl = imgCollection[i].getAttribute('href')
                let img = document.createElement('img');
                img.setAttribute('src', imageUrl)
                img.setAttribute('class', 'modal__image')
                
                let slide = document.createElement('div');
                slide.style.width = modalCenterWidth + 'px'
                slide.setAttribute('class', 'modal__slide')
                slide.append(img)
                imgPlace.append(slide)
    
            }
    
            imgPlace.style.left = -elemNum*modalCenterWidth + 'px'
    
            function slide(elemNum){
                imgPlace.style.left = imgPlace.offsetLeft - elemNum*modalCenterWidth + 'px'
            }
            
        }
    */
}




































