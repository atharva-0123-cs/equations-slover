import React, { useContext, useEffect, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Button, Modal } from 'react-bootstrap';
import { SaveContext } from '../../contexts/saveContext';

import './styles.css';

type UploadModalProps = {
  show: boolean;
  setShow: Function,
  canvasRef: React.MutableRefObject<CanvasDraw>;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  show,
  setShow,
  canvasRef
}) => {
  const { saves } = useContext(SaveContext);
  const [selectedSave, setSelectedSave] = useState<string | null>(null);

  const handleClose = () => setShow(false);

  const handleUpload = () => {
    const save = saves.find(save => save.name === selectedSave);
    if (save) {
      canvasRef.current.loadSaveData(save.saveString);
    }
    handleClose();
  };

  useEffect(() => {
    console.log(saves);
  }, [saves]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header className='save-modal-header'>
        <Modal.Title>Choose a save to Load</Modal.Title>
      </Modal.Header>
      <Modal.Body className='save-modal-body'>
        {
          saves.length > 0 ? (
            <select
              className='save-list'
              value={selectedSave || ''}
              onChange={(e) => setSelectedSave(e.target.value)}
            >
              <option value='' disabled>Select a save</option>
              {saves.map(save => (
                <option key={save.uid} value={save.name} className='save-item'>
                  {save.name}
                </option>
              ))}
            </select>
          ) : (
            <p>Create a save and see it here</p>
          )
        }
      </Modal.Body>
      <Modal.Footer className='save-modal-footer'>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={!selectedSave} // Disable if no save is selected
        >
          Load
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
