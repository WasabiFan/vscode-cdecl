# cdecl Extension for Visual Studio Code

Converts between C syntax and English explanations.

This extension is based off of the "cdecl" program used at https://cdecl.org/.

## Usage

Use the `cdecl: Explain selected text` and `cdecl: Explain typed text` commands to get English explanations for variable declarations and casts.

Alternately, use the `cdecl: Declare` and `cdecl: Cast` commands to convert typed English explanations (following the below syntax) into C/C++.

When running commands that ask for text input, examples are shown in the textbox as a placeholder.

## English examples

- `foo as int`
- `foo as pointer to int`
- `foo as array 6 of int`
- `foo as pointer to array 6 of int`
- `foo as const int`
- `foo as pointer to const int`
- `foo as const pointer to int`

## Full English syntax

The syntax for English text input into cdecl is below.

```
function [( <decl-list> )] returning <english>
block [( <decl-list> )] returning <english>
array [<number>] of <english>
[{ const | volatile | noalias }] pointer to <english>
<type>
```

### `type`
```
{[<storage-class>] [{<modifier>}] [<C-type>]}
{ struct | union | enum } <name>
```

**Note:** `[]` means optional; `{}` means 1 or more; `<>` means defined elsewhere

### Definitions
<dl>
  <dt>decllist</dt>
  <dd>a comma separated list of <name>, <english> or <name> as <english></dd>

  <dt>name</dt>
  <dd>a C identifier</dd>

  <dt>gibberish</dt>
  <dd>a C declaration, like <code>int *x</code>, or cast, like <code>(int *)x</code></dd>

  <dt>storage-class</dt>
  <dd>extern, static, auto, register</dd>
  
  <dt>C-type</dt>
  <dd>int, char, float, double, or void</dd>
  
  <dt>modifier</dt>
  <dd>short, long, signed, unsigned, const, volatile, or noalias</dd>
</dl>