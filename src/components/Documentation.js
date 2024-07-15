
import React from 'react';
import { Row, Col } from '@themesberg/react-bootstrap';

import CodeEditor from "./CodeEditor";

export default (props) => {
  const { title, description, example = null, imports = null, scope = {}, maxHeight = null } = props;

  return (
    <>
      <div className="pt-2">
       
      </div>

      <div className="pb-5">
        <Row className="mt-4">
          <Col xs={12}>
            <CodeEditor code={example} scope={scope} imports={imports} maxHeight={maxHeight} />
          </Col>
        </Row>
      </div>
    </>
  );
};
