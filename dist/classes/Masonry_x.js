export default class Masonry_x {
    constructor(options) {
        this.breakPoints = options.breakPoints ? options.breakPoints : [0, 400, 1000];
        this.lineHeights = options.lineHeights ? options.lineHeights : [100, 200, 300];
        this.gaps = options.gaps ? options.gaps : ['3px', '3px', '4px'];
        this.mainContainer = options.mainContainer ? document.querySelector(options.mainContainer) : document.querySelector('.unf-masonry');
        this.itemContainer = options.itemContainer ? options.itemContainer : '.picture';
        this.masonryItems = this.mainContainer.querySelectorAll(this.itemContainer);
        this.zoom = options.zoom ? options.zoom : undefined;

        this.adaptDefine();
        this.preBuild();

        document.addEventListener('DOMContentLoaded', () => {
            this.build();
            this.loadImg();
            window.onload = () => {
                window.addEventListener('resize', () => {
                    this.adaptDefine();
                    this.onResize();
                });
            };
        });
    }

    // Define breakpoint from the array 'breakPoints' that corresponds to the width of the gallery container
    adaptDefine() {
        this.breakPoints.forEach((point, i) => {
            if (this.mainContainer.clientWidth >= point) {
                this.lineHeight = this.lineHeights[i];
                this.gap = this.gaps[i];
            }
        });
    }

    // Rebuilding the grid when changing the width of the main container
    onResize() {
        this.mainContainerNewWidth = this.mainContainer.clientWidth;
        if (this.mainContainerWidth != this.mainContainerNewWidth) {
            this.build();
            this.setMainContainerWidth();

            this.masonryItems.forEach((element, i) => {
                this.item = element;
                this.loadingImg = i;
                this.item = this.masonryItems[this.loadingImg];
                this.img = this.item.querySelector('img');
                this.place();
            });
        }
    }

    // Add inline css for items of gallery BEFORE loading images.
    // Hide items to wait for images to load
    preBuild() {
        this.masonryItems.forEach((element) => {
            element.removeAttribute('style')
            element.style.cssText = `display: none; opacity: 0;`
            element.querySelector('a').style.cssText = `
            width: 100%; height: 100%; display: block; line-height: 0px; overflow: hidden;`
        })
    }

    build() {

        // Set start values to masonry grid building
        this.loadingImg = 0;
        this.mainContainer.style.margin = -(this.gap) + 'px';
        this.stringsElementsCollection = [];
        this.currentStringElements = [];
        this.stringsWidth = [];
        this.oneStringWidth = 0;
        this.elementPositionX = 0;
        this.elementPositionY = 0;

        // Set params to the main container
        this.setMainContainerWidth();
        this.setMainContainerStyles();
    }

    // Add zoom effect styles (if option is define), and waiting for the image to load
    loadImg() {
        this.item = this.masonryItems[this.loadingImg]
        let img = this.item.querySelector('img')
        if (this.zoom) {
            img.addEventListener('mouseover', (() => {
                img.style.transform = 'scale(1.2)'
                img.style.transition = `all ${this.zoom} cubic-bezier(0.19, 0.15, 0.38, 1.14)`
            }))
            img.addEventListener('mouseout', (() => img.style.transform = ''))
        }
        img.complete ? this.afterLoad() : img.onload = () => this.afterLoad()
    }

    // Place uploaded image in the grid. If the image is not last - loading new
    afterLoad() {
        this.place()
        if (this.loadingImg < this.masonryItems.length - 1) {
            this.loadingImg = this.loadingImg + 1;
            this.loadImg()
        }
    }

    // Image placement in a grid
    place() {
        let img = this.item.querySelector('img')
        img.removeAttribute('style')
        this.item.style.cssText = `
        box-sizing: border-box;
        position: absolute;
        padding-top: ${this.gap};
        padding-left: ${this.gap};
        height: ${this.lineHeight + 'px'};
        width: ${img.naturalWidth * this.lineHeight / img.naturalHeight + 'px'}`;
        img.style.cssText = `width: 100%; height: 100%; object-fit: cover;`;
        this.item.style.paddingTop = this.gap;
        this.item.style.paddingLeft = this.gap;

        if ((this.elementPositionX + (this.item.clientWidth / 2) > this.mainContainer.clientWidth)) {
            this.stringsWidth.push(this.oneStringWidth);
            this.stringsElementsCollection.push(this.currentStringElements);
            this.currentStringElements = [];
            this.elementPositionY += this.lineHeight;
            this.elementPositionX = 0;
            this.mainContainer.style.height = this.elementPositionY + this.lineHeight + 'px';
        }

        this.currentStringElements.push(this.item);
        this.oneStringWidth = this.elementPositionX + this.item.clientWidth;
        this.item.style.left = this.elementPositionX + 'px';
        this.item.style.top = this.elementPositionY + 'px';
        this.elementPositionX += this.item.clientWidth;

        if (this.loadingImg == this.masonryItems.length - 1) {
            this.stringsWidth.push(this.oneStringWidth);
            this.stringsElementsCollection.push(this.currentStringElements);
            this.spreadLast();
        }
    }

    // Reallocate elements on the last two lines
    spreadLast() {
        let penultimateStringWidth = this.stringsWidth[this.stringsWidth.length - 2]
        let lastStringWidth = this.stringsWidth[this.stringsWidth.length - 1];
        let lastStringElements = this.stringsElementsCollection[this.stringsElementsCollection.length - 1];
        let penultimateStringElements = this.stringsElementsCollection[this.stringsElementsCollection.length - 2];

        if ((lastStringWidth < this.mainContainerWidth / 2) && penultimateStringElements.length > 1) {
            let averegeCount = Math.round((this.masonryItems.length - lastStringElements.length) / (this.stringsWidth.length - 1));

            if (averegeCount > 1) {
                this.elementPositionX = 0;
                this.elementPositionY = penultimateStringElements[0].offsetTop;
                penultimateStringElements = [...penultimateStringElements, ...lastStringElements];

                penultimateStringElements.forEach((element) => {
                    element.style.left = this.elementPositionX + 'px';
                    element.style.top = this.elementPositionY + 'px';
                    this.elementPositionX += element.clientWidth;
                });

                this.stringsElementsCollection.pop();
                this.stringsWidth.pop();
                this.stringsElementsCollection.pop();
                this.stringsElementsCollection.push(penultimateStringElements);
                this.stringsWidth[this.stringsWidth.length - 1] = this.elementPositionX;
            }
        }
        this.mainContainer.style.height = this.elementPositionY + this.lineHeight + 'px';
        this.smoothEdge();
    }

    setMainContainerHeight() {
        this.mainContainer.style.height = Math.max(...this.columnsY) + 'px';
    }

    setMainContainerWidth() {
        this.mainContainer.style.width = `calc(100% + ${this.gap})`;
        this.mainContainer.style.marginTop = `-${this.gap}`;
        this.mainContainer.style.marginLeft = `-${this.gap}`;
        this.mainContainerWidth = this.mainContainer.clientWidth;
    }

    setMainContainerStyles() {
        this.mainContainer.style.cssText = `
        display: block; position: relative; height: 100%; overflow: hidden;`;
    }

    // Make the same length of lines
    smoothEdge() {
        for (let i = 0; i < this.stringsElementsCollection.length; i++) {
            let offsetLeft = 0;

            for (let a = 0; a < this.stringsElementsCollection[i].length; a++) {
                let element = this.stringsElementsCollection[i][a];
                this.setMainContainerWidth();
                let newElementWidth = element.clientWidth * this.mainContainerWidth / this.stringsWidth[i];
                element.style.width = newElementWidth + 'px';
                element.style.left = offsetLeft + 'px';
                offsetLeft += newElementWidth;
            }
        }
    }
}
