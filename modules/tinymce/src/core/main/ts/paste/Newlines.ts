/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Arr, Obj } from '@ephox/katamari';

import Entities from '../api/html/Entities';

/*
 * This module contains utilities to convert newlines (\n or \r\n) to BRs or to a combination of the specified block element and BRs
 */

const isPlainText = (text: string): boolean => {
  // so basically any tag that is not one of the "p, div, span, br", or is one of them, but is followed
  // by some additional characters qualifies the text as not a plain text (having some HTML tags)
  // <span style="white-space:pre"> and <br /> are added as separate exceptions to the rule
  return !/<(?:\/?(?!(?:div|p|br|span)>)\w+|(?:(?!(?:span style="white-space:\s?pre;?">)|br\s?\/>))\w+\s[^>]+)>/i.test(text);
};

const toBRs = (text: string): string =>
  text.replace(/\r?\n/g, '<br>');

const openContainer = (rootTag: string, rootAttrs: Record<string, string>): string => {
  let tag = '<' + rootTag;

  const attrs = Obj.mapToArray(rootAttrs, (value, key) => key + '="' + Entities.encodeAllRaw(value) + '"');
  if (attrs.length) {
    tag += ' ' + attrs.join(' ');
  }

  return tag + '>';
};

const toBlockElements = (text: string, rootTag: string, rootAttrs: Record<string, string>): string => {
  const blocks = text.split(/\n\n/);
  const tagOpen = openContainer(rootTag, rootAttrs);
  const tagClose = '</' + rootTag + '>';

  const paragraphs = Arr.map(blocks, (p) => {
    return p.split(/\n/).join('<br />');
  });

  const stitch = (p: string): string => {
    return tagOpen + p + tagClose;
  };

  return paragraphs.length === 1 ? paragraphs[0] : Arr.map(paragraphs, stitch).join('');
};

const convert = (text: string, rootTag: string, rootAttrs: Record<string, string>): string =>
  rootTag ? toBlockElements(text, rootTag, rootAttrs) : toBRs(text);

export {
  isPlainText,
  convert,
  toBRs,
  toBlockElements
};
