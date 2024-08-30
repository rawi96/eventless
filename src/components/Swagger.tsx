'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

function ReactSwagger() {
  return <SwaggerUI url={'/swagger.json'} />;
}

export default ReactSwagger;
