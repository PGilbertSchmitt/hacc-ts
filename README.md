# Hacclang
### (Hastily Arranged Character Combinations)

This language is my second (or third?) attempt at creating a programming language, the first being [Parth](https://github.com/PGilbertSchmitt/parth). This language will be similar, but will also be somewhat influenced by the languages I am most interested in (such as Erlang).

## Philosphy

> "If we don't know what we are doing, the enemy certainly can't anticipate our future actions."  
>\- Colonel Goodhead

I've never been known to make a plan, and it's even rarer that I'd follow it. However, there are a few tenets that I want to adhear to, as contradictory as they may be:

1. Easy to read for the average programmer

  Over the course of a few weekends, I discovered that I love Erlang and what it can do. Once you can read it, it becomes crystal clear what the code is doing. However, having come from more popular languages like Javascript, Ruby, and C, I can attest that at first glance it reads like the Voynich Manuscript. I don't want the average coder to be turned away, so I would prefer traditional forms.

2. Not limited to a single paradigm

  Functional programming a really cool. However, in keeping with the first tenet, I would also allow users to have access to non-functional imperative constructs such as mutability and side effects. I'm not smart enough to build a safe language, the least I can do is make a fun one.

3. Neat devices

  This could potentially contradict the first tenet, but there are some cool advanced features that I would like to implement (hopefully as readable as possible). Things like Erlang's (and Ruby's) set operations are really interesting, as well as list comprehensions and destructuring. It might be difficult to pull off, but what-evs, ya know? This language is for me to play around in, so rather than ideas being set in stone, they're scribbled in sand or a wet napkin.

Honestly, I'm just throwing spaghetti at the wall here. This isn't a good language, and it doesn't do anything particularly well. I'm just having fun.

## TODO

[.] Create parser (raw -> AST)  
[ ] Create compiler (AST -> bytecode)  
[ ] Create VM (bytecode -> where the magic happens)  
[ ] Create AST optimizer  
[ ] Rewrite entire thing in low level language (probably Rust)  

### Potential optimizations

[ ] Convert `Unary('-' number)` to `Number`  
[ ] Unwrap blocks with only one node to just the node itself  