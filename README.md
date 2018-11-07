# Entwine
Entwine lets you play through interactive stories told via Markdown documents. It's little more than a viewer for Markdown documents, but one that lets you browse them in style, in an animated way designed for interactive storytelling.

- [What's this Markdown stuff?](#what-is-markdown)
- [More about Entwine](#how-entwine-works)

## What is Markdown?
Markdown is a simple language for plain text that practically eliminates the need for mouse interaction and makes it super easy to format content. Using common symbols like `#` and `-`, you can create neatly formatted documents with ease.

- [I still don't get it. Can you explain more?](#markdown-example)
- [Great, tell me more about Entwine.](#how-entwine-works)

## Markdown Example
Maybe an example will help. To create a list item in Markdown, just type a `-` symbol and a space followed by your content.

For example, type this to create a list item:  
`- Discuss new features.`

- [Okay I get it, tell me more about Entwine.](#how-entwine-works)

## How Entwine Works
Entwine is really just a viewer for Markdown documents, such as this one. This document is just a Markdown formatted file with a bunch of headers and anchor links pointing to those headers. A Markdown document reader lets you click links to go to those headers. That's really all Entwine does.

- [Okay, why should I use it?](#designed-for-elegance)

## Designed for Elegance
Any Markdown viewer can be used to progress through documents. So why use Entwine?  

Entwine is designed for interactive storytelling. In general, it displays content on an as-needed basis, letting you progress through an elegant interface that can be configured for the story being told.

- [Configured? How?](#configurable)

## Configurable
Entwine is fully themable/skinnable using CSS. There are also a bunch of pre-made themes to learn from or just use as needed. The project is built for GitHub Pages, where modifications are as easy as possible. Just create a fork of the project and you'll have a ready-made site to configure however you need.

- [Themes? Where?](#themes)
- [What is GitHub?](#github-and-github-pages)

## GitHub and GitHub Pages
GitHub is a developer focused code-hosting platform. GitHub Pages lets you host code for HTML websites at no cost. With that, you can host your own Entwine-driven website for free.

## Themes
Entwine is part of a set of core projects ([BreakDown](https://ugotsta.github.io/breakdown/) framework) utilizing the same themes so it's able to use those existing themes. Check out the themes using the CSS Theme selector in the info panel. Or find out more from the link below.

- [What link?](#example-css-themes)

## Example CSS Themes
The following are some of the avaialable themes as examples of what is possible:
- [Technology](https://gist.github.com/adc373c2d5a5d2b07821686e93a9630b) - Futuristic, tech theme with blue hues.
- [Saint Billy](https://gist.github.com/76c39d26b1b44e07bd7a783311caded8) - Low-down, grittiest, in-need-a-forgivenest Western theme.
- [Old Glory](https://gist.github.com/43bff1c9c6ae8a829f67bd707ee8f142) - Patriotic throwback to American antiquity.
- [Ghastly](https://gist.github.com/d1a6d5621b883bf6af886855d853d502) - Eerie off-shoot of Old Glory.
- [Writing on the Wall](https://gist.github.com/241b47680c730c7162cb5f82d6d788fa) - The writing's on the cavern walls.

# Entwine `🅑-nav`

`ⓘ The code below designates a list of content sources the user will be able to select from in the app.`

content `🅑-datalist`
- [Await](https://gist.github.com/eb48e3ccd0e0fc6a502a8ebe02a38715)

## Appearance `🅑-collapsible`

css `🅑-datalist`
- [Writing on the Wall](https://gist.github.com/241b47680c730c7162cb5f82d6d788fa) - The writing's on the cavern walls.

`🅑-theme-variables`

## Effects `🅑-collapsible`

vignette-blend `🅑-select`

vignette `🅑-slider="0.25,0,1,0.025"`

svg-filter `🅑-select`
- *None

---

brightness `🅑-slider="1,0,3,0.05"`
contrast `🅑-slider="100%,0,300,1,%"`
grayscale `🅑-slider="0%,0,100,1,%"`
hue-rotate `🅑-slider="0deg,0,360,1,deg"`
invert `🅑-slider="0%,0,100,1,%"`
saturate `🅑-slider="100%,0,300,1,%"`
sepia `🅑-slider="0%,0,100,1,%"`
blur `🅑-slider="0px,0,20,1,px"`

## Perspective `🅑-collapsible`

scale `🅑-slider="0,1,5,0.1"`
perspective `🅑-slider="1500px,0,2000,1,px"`
originx `🅑-slider="50%,0,100,1,%"`
originy `🅑-slider="50%,0,100,1,%"`
rotatex `🅑-slider="0deg,0,360,1,deg"`
rotatey `🅑-slider="0deg,0,360,1,deg"`
scalez `🅑-slider="0,1,5,0.1"`
rotatez `🅑-slider="0deg,0,360,1,deg"`
translatez `🅑-slider="0px,-500,500,1,px"`

## Dimensions `🅑-collapsible`

width `🅑-slider="960px,4,4000,1,px"`
height `🅑-slider="400px,4,2000,1,px"`
padding `🅑-slider="10px,0,500,1,px"`
inner-space `🅑-slider="100px,0,300,1,px"`
outer-space `🅑-slider="0px,0,300,1,px"`
offsetx `🅑-slider="0px,-4000,4000,1,px"`
offsety `🅑-slider="0px,-4000,4000,1,px"`

## Contents `🅑-collapsible`

`🅑-toc`

## Help `🅑-group`

`🅑-help`
`🅑-hide`
