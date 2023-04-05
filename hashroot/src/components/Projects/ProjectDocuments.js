import React from "react";
import Card from "react-bootstrap/esm/Card";
import CloseButton from "react-bootstrap/esm/CloseButton";
import Nav from "react-bootstrap/esm/Nav";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import fileDownload from "js-file-download";
import Stack from "react-bootstrap/esm/Stack";
import Badge from "react-bootstrap/esm/Badge";
import FormText from "react-bootstrap/esm/FormText";
import { toast } from "react-toastify";
import {
  BsCloudDownloadFill,
  BsFileCheckFill,
  BsFileEarmarkFill,
  BsFileEarmarkFontFill,
  BsFillStarFill,
  BsFillFileEarmarkDiffFill,
} from "react-icons/bs";
// import { AiFillDelete } from "react-icons/ai";

import { downloadProjectDocumentApi } from "../../api/projects";
import { PROJECT_UPLOAD_TYPES } from "../../constants";
import { capitalize } from "../../utils/user";

const tabs = ["all", ...Object.values(PROJECT_UPLOAD_TYPES)];

const ProjectDocuments = ({ project, onClose }) => {
  const [currentTab, setCurrentTab] = React.useState("all");

  const handleDocumentDownload = async (document) => {
    try {
      toast("Downloading document...", { type: toast.TYPE.INFO, autoClose: 0 });
      const response = await downloadProjectDocumentApi(
        project._id,
        document.fileId
      );

      fileDownload(response.data, document.originalname);
    } catch (error) {
      toast("Error downloading document");
    }
  };

  const tabDocuments = React.useMemo(() => {
    if (currentTab === "all") {
      return project?.documents;
    }
    return project?.documents?.filter(
      (document) => document.type === currentTab
    );
  }, [currentTab, project]);

  return (
    <Card className="shadow-sm mt-3 h-100">
      <Card.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Card.Text style={{ marginBottom: 0 }}>
          <b>Project Documents</b>
        </Card.Text>
        <CloseButton variant="white" onClick={onClose} />
      </Card.Header>
      <Card.Body className="mb-0 flex-1">
        {project?.documents?.length ? (
          <Stack gap={3}>
            <Nav
              variant="pills"
              activeKey={currentTab}
              onSelect={setCurrentTab}
              style={{
                paddingBottom: "1rem",
                borderBottom: "1px solid #dee2e6",
              }}
            >
              {tabs.map((type) => (
                <Nav.Item key={type}>
                  <Nav.Link eventKey={type}>{capitalize(type)}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            {tabDocuments?.length ? (
              <Row>
                {tabDocuments?.map((document) => (
                  <DocumentItem
                    document={document}
                    handleDocumentDownload={handleDocumentDownload}
                    key={document._id}
                  />
                ))}
              </Row>
            ) : (
              <Card className="no-file">
                <Card.Body>No documents available</Card.Body>
              </Card>
            )}
          </Stack>
        ) : (
          <Card.Text className="text-center">No documents uploaded</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

const DocumentItem = ({
  document,
  handleDocumentDownload,
  handleDocumentDelete,
}) => (
  <Col xs={6} sm={4} lg={2} key={document._id}>
    <Card style={{ width: "100%" }}>
      <Card.Body
        style={{
          height: "4rem",
          padding: "0.5rem",
          textAlign: "center",
          lineHeight: 1.2,
          textOverflow: "ellipsis",
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FormText>{document.originalname}</FormText>
      </Card.Body>
      <Card.Footer style={{ justifyContent: "space-between", display: "flex" }}>
        <DocumentBadge document={document} />
        <Stack
          direction="horizontal"
          gap={1}
          style={{ justifyContent: "flex-end" }}
        >
          <BsCloudDownloadFill
            className="link"
            onClick={() => handleDocumentDownload(document)}
          />
          {/* TODO: Need to implement delete file? */}
          {/* <AiFillDelete
            className="link"
            onClick={() => handleDocumentDelete(document)}
          /> */}
        </Stack>
      </Card.Footer>
    </Card>
  </Col>
);

const DocumentBadge = ({ document }) => {
  const bg =
    document?.type === PROJECT_UPLOAD_TYPES.contract
      ? document.latest &&
        document.customerSign &&
        document.generalContractorSign
        ? "success"
        : "warning"
      : "secondary";
  return (
    <Stack gap={2} direction="horizontal">
      {document?.type === PROJECT_UPLOAD_TYPES.contract && document.latest && (
        <Badge bg="success">
          <BsFillStarFill />
        </Badge>
      )}
      <Badge bg={bg}>
        {document?.type === PROJECT_UPLOAD_TYPES.contract ? (
          document.latest ? (
            document.customerSign && document.generalContractorSign ? (
              <BsFileCheckFill />
            ) : document.customerSign ? (
              <BsFillFileEarmarkDiffFill />
            ) : (
              <BsFileEarmarkFontFill />
            )
          ) : (
            <BsFileEarmarkFill />
          )
        ) : (
          <BsFileEarmarkFill />
        )}
      </Badge>
    </Stack>
  );
};

export default ProjectDocuments;
