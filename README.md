# P-adic number explorable explanation

[Check the live explorable](https://logicien.fr/padic/)

## P-adic numbers

In mathematics, the p-adic number system for any prime number p extends the ordinary arithmetic of the rational numbers in a different way from the extension of the rational number system to the real and complex number systems. The extension is achieved by an alternative interpretation of the concept of "closeness" or absolute value. In particular, two p-adic numbers are considered to be close when their difference is divisible by a high power of p: the higher the power, the closer they are. This property enables p-adic numbers to encode congruence information in a way that turns out to have powerful applications in number theory. [https://en.wikipedia.org/wiki/P-adic_number](Wikipedia)

## Todo

- Convert from p-adic expansion to ratio
- Add better explanations for the padic digits computation
- Add SVG inscribed circles viz

## Tech stack

- Vue
- TailwindCSS
- Typescript

## Related links

### Videos

- [Youtube introduction](https://www.youtube.com/watch?v=_9POg4HSgfI)
- [3Blue1Brown](https://www.youtube.com/watch?v=XFDM1ip5HdU)

### Docs and articles

- [Long division method](https://stackoverflow.com/questions/62527047/implementing-long-division-while-checking-for-repeating-decimals)
- [Code golf](https://codegolf.stackexchange.com/questions/63629/calculate-the-p-adic-norm-of-a-rational-number)
- [padic computation paper](ttps://hal.archives-ouvertes.fr/hal-01444183/document)
- [Python implementation](https://gist.github.com/meagtan/87b550d5129cc557ed6821c6f18af38b)
- [Publication](http://www.sens-neuchatel.ch/bulletin/no18/art18-2-robert.pdf)
- [Math Exchange](https://math.stackexchange.com/questions/1186967/method-of-finding-a-p-adic-expansion-to-a-rational-number/1187037#1187037)
- [RosettaCode](http://rosettacode.org/wiki/P-Adic_numbers,_basic)
- [Introduction SciAmerican](https://blogs.scientificamerican.com/roots-of-unity/the-numbers-behind-a-fields-medalists-math/)

## Project setup

```bash
yarn install
```

### Compiles and hot-reloads for development

```bash
yarn serve
```

### Compiles and minifies for production

```bash
yarn build
```

### Run your unit tests

```bash
yarn test:unit
```

### Lints and fixes files

```bash
yarn lint
```
