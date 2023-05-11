import { useState, useEffect, useContext, memo } from "react";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { ConnectionState, SharedString } from "fluid-framework";
import { CollaborativeTextArea } from './CollaborativeTextArea/CollaborativeTextArea';
import { SharedStringHelper } from "@fluid-experimental/react-inputs";
import { AppContext } from '../../../utils/AppContextProvider';

// Main Fluid component, using memo() to reduce unnecessary and costly re-rendering of the component
const FreetextArea = memo((props) => {
  const sharedString = useSharedString(props.container, props.patient_id);

  if (sharedString) {
    return (
      <div className="app">
        <CollaborativeTextArea sharedStringHelper={new SharedStringHelper(sharedString)} />
      </div>
    );
  } else {
    return <div />;
  }
})

function useSharedString(container_id, patient_id) {
  const [sharedString, setSharedString] = useState();
  const { createContainer } = useContext(AppContext)

  const getFluidData = async () => {
    // Configuring fluid container.
    const client = new TinyliciousClient();
    const containerSchema = {
      initialObjects: {
        sharedString: SharedString
      }
    };

    // Retrieving container from Fluid service.
    let container;
    let containerId = container_id;

    // Create new container if doesn't already exist
    if (container_id === "") {
      ({ container } = await client.createContainer(containerSchema));
      const id = await container.attach();
      // Store created container id on db
      await createContainer(patient_id, id)
      containerId = id
      return container.initialObjects.sharedString;
    }
    // Retrieve container if already exists
    ({ container } = await client.getContainer(containerId, containerSchema));
    if (container.connectionState !== ConnectionState.Connected) {
      await new Promise((resolve) => {
        container.once("connected", () => {
          resolve();
        });
      });
    }
    return container.initialObjects.sharedString;
  }

  // Get Fluid Data on initial render and store in state.
  useEffect(() => {
    getFluidData()
      .then((data) => setSharedString(data));
  }, []);
  return sharedString;
}

export default FreetextArea;