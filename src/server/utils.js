import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';

export const render = (store, routes, req, context) => {
    const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.path} context={context}>
          {renderRoutes(routes)}
        </StaticRouter>
      </Provider>
    );
    const helmet = Helmet.renderStatic();

    const cssStr = context.css.length ? context.css.join('\n') : '';

    // window.context是数据的注水
    return (`
    <html>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        <style>${cssStr}</style>
      </head>
      <body>
        <div id="root">${content}</div>
        <script>
            window.context = {
              state: ${JSON.stringify(store.getState())}
            }
        </script>
        <script src='/index.js'></script>
      </body>
    </html>
  `);
}