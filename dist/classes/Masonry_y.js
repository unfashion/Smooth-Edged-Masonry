export default class Masonry {
    constructor(options) {
        this.breakPoints = options.breakPoints ? options.breakPoints : [0, 400, 1000];
        this.columns = options.columns ? options.columns : [1, 2, 3];
        this.gaps = options.gaps ? options.gaps : ['3px', '3px', '4px'];
        this.mainContainer = options.mainContainer ? document.querySelector(options.mainContainer) : document.querySelector('.unf-masonry');
        this.itemContainer = options.itemContainer ? options.itemContainer : '.picture';
        this.masonryItems = this.mainContainer.querySelectorAll(this.itemContainer);
        this.zoom = options.zoom ? options.zoom : undefined;

        this.setMainContainerStyles();
        this.preBuild();
        this.adaptDefine()

        document.addEventListener("DOMContentLoaded", () => {
            this.build();
            this.loadImg();

            window.addEventListener('load', () => {
                this.reConstruct();
                window.addEventListener('resize', () => this.onResize())
            })
        })
    }
    // Define breakpoint from the array 'breakPoints' that corresponds to the width of the gallery container
    adaptDefine() {
        this.breakPoints.forEach((point, i) => {

            if (this.mainContainer.clientWidth >= point) {
                this.columnsCount = this.columns[i]
                this.gap = this.gaps[i]
            }
        })
    }

    // Rebuilding the grid when changing the width of the main container
    onResize() {
        this.setMainContainerWidth()
        this.adaptDefine()
        this.mainContainerNewWidth = this.mainContainer.clientWidth;
        if (this.mainContainerWidth != this.mainContainerNewWidth) {
            this.reConstruct();
        }
    }

    reConstruct() {
        this.loadingImg = 0
        this.build();
        this.masonryItems.forEach((element, i) => {
            this.item = element;
            element.removeAttribute('style')
            this.place()
            if (i == this.masonryItems.length - 1) this.colsAlign()
        })
    }

    // Add inline css for items of gallery BEFORE loading images.
    // Hide items to wait for images to load
    preBuild() {
        this.masonryItems.forEach((item) => {
            item.querySelector('a').style.cssText = `
            width: 100%;
            height: 100%; 
            display: block; 
            line-height: 0px;
            overflow: hidden; 
            `
        })

        this.loadingImg = 0;
        this.setMainContainerWidth()
        this.masonryItems.forEach((element) => {
            element.removeAttribute('style')
            element.style.cssText = `display: none; opacity: 0;`
        })
    }

    //Define arrays and set start values to masonry grid building
    build() {
        this.mainContainerWidth = this.mainContainer.clientWidth;
        this.columnWidth = this.mainContainerWidth / this.columnsCount;
        this.columnsX = [];
        this.columnsY = [];
        this.columnsElementsCollection = [];

        for (let i = 0; i < this.mainContainerWidth; i = i + this.columnWidth) {
            this.columnsX.push(i);
            this.columnsY.push(0);
            this.columnsElementsCollection.push([])
        }
    }

    // Add zoom effect styles (if option is define), and waiting for the image to load
    loadImg() {
        this.item = this.masonryItems[this.loadingImg]
        let img = this.item.querySelector('img')
        img.style.cssText = `width: 100%; height: 100%; object-fit: cover;`;
        if (this.zoom) {
            img.style.transition = `all ${this.zoom} cubic-bezier(0.19, 0.15, 0.38, 1.14)`;
            img.addEventListener('mouseover', (() => img.style.transform = 'scale(1.2)'));
            img.addEventListener('mouseout', (() => img.style.transform = ''));
        }
        img.complete ? this.afterLoad() : img.onload = () => this.afterLoad()
    }

    // Place uploaded image in the grid. If the image is not last - loading new
    afterLoad() {
        this.item.removeAttribute('style')
        this.place()
        if (this.loadingImg < this.masonryItems.length - 1) {

            this.loadingImg = this.loadingImg + 1;
            this.setMainContainerHeight();
            this.loadImg()
        } else {
            this.reConstruct();
        }
    }

    setMainContainerHeight() {
        this.mainContainer.style.height = Math.max(...this.columnsY) + 'px';

    }

    setMainContainerWidth() {
        this.mainContainer.style.width = `calc(100% + ${this.gap})`
        this.mainContainer.style.marginTop = `-${this.gap}`
        this.mainContainer.style.marginLeft = `-${this.gap}`
    }

    setMainContainerStyles() {
        this.mainContainer.style.cssText = `display: block; position: relative; height: 100%; overflow: hidden;`
    }

    // Image placement in the grid
    place() {
        this.item.style.cssText = `
        box-sizing: border-box;
        position: absolute;
        padding-top: ${this.gap};
        padding-left: ${this.gap};
        width: ${this.columnWidth + 'px'};
        `
        let itemHeight = this.item.clientHeight
        let minColumnHeight = Math.min(...this.columnsY);
        let minHeightColumnIndex = this.columnsY.indexOf(minColumnHeight);
        this.item.style.left = this.columnsX[minHeightColumnIndex] + 'px';
        this.columnsElementsCollection[minHeightColumnIndex].push(this.item);
        this.item.style.top = minColumnHeight + 'px';
        this.columnsY[minHeightColumnIndex] = this.columnsY[minHeightColumnIndex] + this.item.clientHeight;
    }

    // Make the column heights the same
    colsAlign() {
        let averageColumnHeight = (this.columnsY.reduce((a, b) => a + b)) / this.columnsY.length;
        this.mainContainer.style.height = averageColumnHeight + 'px';
        for (let i = 0; i < this.columnsY.length; i++) {
            let offsetTop = 0;
            for (let a = 0; a < this.columnsElementsCollection[i].length; a++) {
                let element = this.columnsElementsCollection[i][a];
                let newElementHeight = element.clientHeight * averageColumnHeight / this.columnsY[i];
                element.style.height = newElementHeight + 'px';
                element.style.top = offsetTop + 'px';
                offsetTop += newElementHeight;
            }
        }
    }
}