import React from 'react';
import { withTranslation } from 'react-i18next';
import { Editor } from '../Editor/Editor';
import { RealtimeEditor } from '@/Editor/RealtimeEditor';
import config from 'config';
import usePostHog from '../_hooks/usePostHog';
const AppLoaderComponent = React.memo((props) => {
  usePostHog();
  return config.ENABLE_MULTIPLAYER_EDITING ? <RealtimeEditor {...props} /> : <Editor {...props} />;
});

export const AppLoader = withTranslation()(AppLoaderComponent);
