import { Fragment, useState } from "react";
import { ModalPerson } from "./blocks/persons";
import { Container } from "@/components/container";
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from "@/partials/toolbar";

import { PartiesPersonContent } from "./PartiesPersonsContent";
import { useLayout } from "@/providers";

export interface IPersonModalContentProps {
  state: boolean;
}

const PartiesPersonsPage = () => {
  const { currentLayout } = useLayout();
  // state management
  const [personModalOpen, setPersonModalOpen] = useState(false);
  // handle close
  const handleClose = () => {
    setPersonModalOpen(false);
  };
  const openPersonModal = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setPersonModalOpen(true);
  };
  return (
    <Fragment>
      {currentLayout?.name === "demo1-layout" && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-600">All Members:</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Import CSV
              </a>
              <a className="btn btn-sm btn-primary" onClick={openPersonModal}>
                Add Person
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <PartiesPersonContent />
        <ModalPerson open={personModalOpen} onOpenChange={handleClose} />
      </Container>
    </Fragment>
  );
};

export { PartiesPersonsPage };
