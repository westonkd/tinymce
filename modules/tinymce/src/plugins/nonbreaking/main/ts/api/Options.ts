/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Type } from '@ephox/katamari';

import Editor from 'tinymce/core/api/Editor';
import { EditorOptions } from 'tinymce/core/api/OptionTypes';

const option: {
  <K extends keyof EditorOptions>(name: K): (editor: Editor) => EditorOptions[K] | undefined;
  <T>(name: string): (editor: Editor) => T | undefined;
} = (name: string) => (editor: Editor) =>
  editor.options.get(name);

const register = (editor: Editor): void => {
  const registerOption = editor.options.register;

  registerOption('nonbreaking_force_tab', {
    processor: (value) => {
      if (Type.isBoolean(value)) {
        return { value: value ? 3 : 0, valid: true };
      } else if (Type.isNumber(value)) {
        return { value, valid: true };
      } else {
        return { valid: false, message: 'Must be a boolean or number.' };
      }
    },
    default: false
  });

  registerOption('nonbreaking_wrap', {
    processor: 'boolean',
    default: true
  });
};

const getKeyboardSpaces = option<number>('nonbreaking_force_tab');
const wrapNbsps = option<boolean>('nonbreaking_wrap');

export {
  register,
  getKeyboardSpaces,
  wrapNbsps
};
