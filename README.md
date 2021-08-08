# P-adic number library

## P-adic numbers

In mathematics, the p-adic number system for any prime number p extends the ordinary arithmetic of the rational numbers in a different way from the extension of the rational number system to the real and complex number systems. The extension is achieved by an alternative interpretation of the concept of "closeness" or absolute value. In particular, two p-adic numbers are considered to be close when their difference is divisible by a high power of p: the higher the power, the closer they are. This property enables p-adic numbers to encode congruence information in a way that turns out to have powerful applications in number theory. [https://en.wikipedia.org/wiki/P-adic_number](Wikipedia)

## Todo

- Convert from p-adic expansion to ratio
- Check edge cases for numerator and denominator
- Add inscribed circle viz

## Typescript implementation

- Ratio class and operations
- P-adic class with absolute value, norm and expansion.
- Jest tests

## Related links

### Videos

- [https://www.youtube.com/watch?v=_9POg4HSgfI](Youtube)
- [https://www.youtube.com/watch?v=XFDM1ip5HdU](3Blue1Brown)

### Docs and articles

- [https://stackoverflow.com/questions/62527047/implementing-long-division-while-checking-for-repeating-decimals](long division with repeated decimals)
- [https://codegolf.stackexchange.com/questions/63629/calculate-the-p-adic-norm-of-a-rational-number](Code golf interesting)
- [https://hal.archives-ouvertes.fr/hal-01444183/document](padic code)
- [https://gist.github.com/meagtan/87b550d5129cc557ed6821c6f18af38b](python implémentation)
- [http://www.sens-neuchatel.ch/bulletin/no18/art18-2-robert.pdf](Publication)
- [https://math.stackexchange.com/questions/1186967/method-of-finding-a-p-adic-expansion-to-a-rational-number/1187037#1187037](math.stackexchange.com)
- [http://rosettacode.org/wiki/P-Adic_numbers,_basic](RosettaCode)
- [https://blogs.scientificamerican.com/roots-of-unity/the-numbers-behind-a-fields-medalists-math/](Vulgarization)
- [https://www.sangakoo.com/en/unit/p-adic-distance](p-adic distance)

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
