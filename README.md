
# Smooth Edged Masonry
**[Demo](https://unfashion.github.io/Smooth-Edged-Masonry/example/)**  

**SE Masonry** — is a simple lightweight script that allows you to display a set of images on a page in a masonry grid. The grid can be oriented both horizontally and vertically.  

The columns or rows of the grid are lined up and adjusted to compensate for "uneven edges". Thus, your gallery will always have the shape of a rectangle, beyond which nothing will go out.

## Features ##
- Horizontal and vertical orientation of the grid to choose from
- Responsive behavior settings for screens or containers of different widths
- Open source and the ability to refine solutions using JS and CSS
- Vanilla JS without dependencies

**Note!** At the moment, SE Masonry does not have its own lightbox for viewing images, but we are working on it!

## Contents of the repository
`/dist` - contains a folder "class" with js classes files (both original and minified) 

`/dist/classes/Masonry_x.js` - class for creating horizontal masonry

`/dist/classes/Masonry_y.js` - class for creating vertical masonry

`/example` - working example of gallery 

`/example/index.html` - demo html file. Contains the structure of two simple galleries (with horizontal and vertical spreading). Images are stored in `/public/img/`. Also the html contains the tag `<script type="module">`, inside which both classes are imported from `/public/classes`, and based on these classes, two objects are created that initiate the script.

`/example/style.css` sets the appearance of the gallery. These styles have been set for example and it is not necessary to use in your own project.


# How it works
The clear code is worth a thousand words. You can see how the script works by looking at the code of `/example/index.html`, or just visit the [demo page](https://unfashion.github.io/Smooth-Edged-Masonry/example/)

**Note!** If you want to see an example (`/example/index.html`) running offline, you need to run this file through a local web server. You can use solutions like "Live Server", or "Dev Server". If you do not know how to work with local servers, then the easiest way is to upload the entire contents of the `/example/` folder to your hosting and check the script online.

## Script embedding
In case of `/example/index.html` the classes are imported in module mode.
```html 
<script type="module">
...
</script>
```


### Creating horizontal masonry 

```js
// Import class with horizontal gallery
import Masonry_x from './classes/Masonry_x'

new Masonry_x({

    // Main container of gallery
    mainContainer: '.unf-masonry-x',

    // Gallery element selector
    itemContainer: '.unf-masonry__item',

    // An array of breakpoints for the width of the main gallery container
    // (in pixels, without units)
    breakPoints: [0, 400, 1000],

    // The height of the images (in pixels, without units).
    // Each value corresponds to a breakpoint from the  breakPoints array
    lineHeights: [200, 300, 400],

    // The gaps between the images.
    // Together with the units of measurement.
    // Each value corresponds to a breakpoint from the  breakPoints array
    gaps: ['1px', '2px', '3px'],

    // Optional parameter that adds a zoom effect when hovering over the image.
    // The value is specified in time units. In this example '2s' is 2 seconds.
    zoom: '2s',
  });
  ```

### Creating vertical masonry 

```js
import Masonry_y from './classes/Masonry_y'

new Masonry_y({

    // Main container of gallery
    mainContainer: '.unf-masonry-x',

    // Items of gallery
    itemContainer: '.unf-masonry__item', 

    // An array of breakpoints for the width of the main gallery container
    // (in pixels, without units)
    breakPoints: [0, 400, 1000],

    // Columns count. 
    // Each value corresponds to a breakpoint from the  breakPoints array
    columns: [1, 2, 3],

    // The gaps between the images.
    // Together with the units of measurement.
    // Each value corresponds to a breakpoint from the  breakPoints array
    gaps: ['3px', '3px', '4px'],

    // Optional parameter that adds a zoom effect when hovering over the image.
    // The value is specified in time units. In this example '2s' is 2 seconds.
    zoom: '2s',

});
  ```


## Basic html structure
```html
<!-- Main container of gallery -->
<div class="unf-masonry">

    <!-- "Item 1" -->
    <div class="unf-masonry__item">
        <a href="./img/01.jpg">
            <img src="./img/01.jpg" alt="" class="unf-masonry__img">
        </a>
    </div>

    <!-- "Item 2" -->
    <div class="unf-masonry__item">
        <a href="./img/02.jpg">
            <img src="./img/02.jpg" alt="" class="unf-masonry__img">
        </a>
    </div>

    ...

</div>

```

