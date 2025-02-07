import { Keys } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';
import { McEditor, TinyAssertions, TinyContentActions, TinySelections } from '@ephox/wrap-mcagar';

import Editor from 'tinymce/core/api/Editor';

describe('browser.tinymce.core.keyboard.EnterKeyInlineTest', () => {

  const settings = {
    base_url: '/project/tinymce/js/tinymce',
    inline: true
  };

  it('Pressing shift+enter in brMode inside a h1 should insert a br', async () => {
    const editor = await McEditor.pFromHtml<Editor>('<h1>ab</h1>', { ...settings, forced_root_block: false });
    editor.focus();
    TinySelections.setCursor(editor, [ 0 ], 1);
    TinyContentActions.keystroke(editor, Keys.enter(), { shift: true });
    TinyAssertions.assertContent(editor, 'a<br>b');
    McEditor.remove(editor);
  });
});
