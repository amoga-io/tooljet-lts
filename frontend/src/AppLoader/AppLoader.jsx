import React from 'react';
import { withTranslation } from 'react-i18next';
import { Editor } from '../Editor/Editor';
import { RealtimeEditor } from '@/Editor/RealtimeEditor';
import config from 'config';

const AppLoaderComponent = React.memo((props) => {
  console.log('config.ENABLE_MULTIPLAYER_EDITING', config.ENABLE_MULTIPLAYER_EDITING);
  return config.ENABLE_MULTIPLAYER_EDITING ? <RealtimeEditor {...props} /> : <Editor {...props} />;
});

export const AppLoader = withTranslation()(AppLoaderComponent);
