
# FRP

**F**unctional **R**eactive **P**rogramming


----



## What?

Soltanto un altro modo per gestire **eventi asincroni**.

Tutto è un flusso di dati e si possono utilizzare le tecniche della **programmazione funzionale**
applicandole a questi stream anziché a delle semplici sequenze.

Anziché ottenere una sequenza trasformata, otterremo uno **stream** trasformato in tempo reale .


----


![what](what.gif)

----


## Esempio

Programmazione funzionale su sequenze

```
// map
[1,2,3,4].map(function (el) {
  return el * 2;
});

// [2,4,6,8]
```

FRP su stream

```
stream:        ---1----2--3----4------3-->
               vvvvv map(el * 2) vvvvvvvv
doubledStream: ---2----4--6----8------6-->
```



----


## Creare stream

Le varie librerie di FRP solitamente consentono di creare stream osservabili a partire da:

* Eventi nel DOM
* Node.js Event Emitter
* Promises
* Callbacks (anche nel formato cb(err, data) di Node)
* Valori costanti
* Array
* etc...


---


# TRASFORMAZIONI



----


## Map

```
s:  --1---2--3----4------->
    vvv map(fn(el)) vvvvvv
    vvv fn(el): el * 2 vvv
s1: --2---4--6----8------->
```

Ogni elemento nello stream ***s*** viene passato alla funzione ***fn*** e il risultato viene emesso nel nuovo stream ***s1***


----


## Filter

```
s:  --1---2--3----4------->
    vvv map(fn(el)) vvvvvv
    vvv fn(el): el > 2 vvv
s1: ---------3----4------->
```

Ogni elemento nello stream ***s*** viene passato alla funzione ***fn***, se essa ritorna true allora quell'elemento viene emesso nel nuovo stream ***s1***


----


## Scan

```
s:  --1---2--3----04------->
    vvv map(fn(p,n)) vvvvvv
    vvv fn(p,n): p + n vvvv
s1: --1---3--6----10------->
```

Ogni nuovo elemento nello stream ***s*** viene passato ad una funzione accumulatrice ***fn(prev, next)*** e il risultato parziale viene emesso nel nuovo stream ***s1***


----


## Fold o Reduce

```
s:  --1---2--3----04-------X
    vvv map(fn(p,n)) vvvvvv
    vvv fn(p,n): p + n vvvv
s1: -----------------------10>
```

Simile a ***scan***, ma il valore accumulato viene emesso solo quando ***s*** termina


----


## Throttle e Debounce

```
s:  1234-----3456-74---12-->
    vvv throttle(2000) vvvv
s1: --1--4-----4--6--4---2->
```

Gli eventi in ***s*** vengono emessi in ***s1*** al rate massimo di uno ogni 2000ms, eventuali eventi intermedi vengono scartati

```
s:  1234-----3456-74---12-->
    vvv debounce(2000) vvvv
s1: -----4-----------4----2>
```

Su ***s1*** vengono emessi soltanto gli eventi di ***s*** che siano seguiti da almeno 2000ms di “silenzio”


----


## flatMap

Dato uno stream, per ogni dato viene invocata una funzione che restituisca un nuovo stream, tutti i dati emessi da tutti gli stream vengono “flattati” e demessi in un unico stream

Esempio pratico: dato uno stream di url di risorse si applica il flatMap con una funzione che ritorni uno stream ottenuto dalla promise di una richiesta ajaxsu quell'url. Alla fine avremo uno stream contenente le risposte di tutte le richieste.


----


## E molto altro ancora...

* [Operatori RxJS](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/which-instance.md)
* [bacon.js API](https://github.com/baconjs/bacon.js/#common-methods-in-eventstreams-and-properties)
* [highlandjs API](http://highlandjs.org/)
* [rxmarbles](http://rxmarbles.com/)

----


## Ricapitolando

* Stream di qualcunque cosa: dati, eventi, stream, stream di stream, streamception
* Controllo sul fattore tempo
* Avendo ben chiaro lo svolgersi degli eventi nel tempo modellare comportamenti anche complessi può divenire molto semplice
* Codice molto leggibile
* Esattamente come nella programmazione funzionale concatenando qualche map, filter e reduce si può far arrivare un razzo sulla luna


----


## Librerie Esistenti

* [RxJs](https://github.com/Reactive-Extensions/RxJS) - probabilmente la più matura, implementata in vari linguaggi e molto performante
* [Bacon.js](https://github.com/baconjs/bacon.js) - nome figo, logo figo, molto hype su github (in origine RxJs non era open source...)
* [Highland.js](http://highlandjs.org/) - Basata sugli stream nativi di Node.js condita con Browserify
* [elm](http://elm-lang.org/) - linguaggio simile ad haskell che compila in javascript completamente fondato sull'FRP (figata assurda)

