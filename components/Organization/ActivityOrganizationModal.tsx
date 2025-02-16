import { t } from 'i18next';
import { observer } from 'mobx-react';
import { createRef, FormEvent, PureComponent } from 'react';
import { Button, Form, Modal, ModalProps } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import {
  Organization,
  OrganizationModel,
  OrganizationTypeName,
} from '../../models/Organization';

export interface OrganizationModalProps
  extends Pick<ModalProps, 'show' | 'onHide'> {
  store: OrganizationModel;
  onSave?: () => any;
}

interface OrganizationForm extends Organization {
  logoURI: string;
}

@observer
export class OrganizationModal extends PureComponent<OrganizationModalProps> {
  private form = createRef<HTMLFormElement>();

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { store, onSave } = this.props;

    const { name, description, type, logoURI } = formToJSON<
      Pick<OrganizationForm, 'name' | 'description' | 'type' | 'logoURI'>
    >(event.currentTarget);

    await store.updateOne({
      name,
      description,
      type,
      logo: {
        name,
        description: description!,
        uri: logoURI,
      },
    });
    onSave?.();
    this.handleReset();
  };

  handleReset = () => {
    this.form.current?.reset();
    this.props.onHide?.();
  };

  render() {
    const { show, onHide, store } = this.props;
    const loading = store.uploading > 0;

    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('add_sponsor_information')}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          as="form"
          ref={this.form}
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
        >
          <Form.Group className="mt-2" controlId="name">
            <Form.Label>{t('name')}</Form.Label>
            <Form.Control
              name="name"
              placeholder={t('please_enter_name')}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2" controlId="description">
            <Form.Label>{t('description')}</Form.Label>
            <Form.Control
              name="description"
              placeholder={t('please_enter_description')}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2" controlId="type">
            <Form.Label>{t('type')}</Form.Label>
            <Form.Select name="type">
              {Object.entries(OrganizationTypeName).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-2" controlId="logo-uri">
            <Form.Label>{t('logo_url')}</Form.Label>
            <Form.Control
              name="logoURI"
              placeholder={t('please_enter_logo_url')}
              required
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" type="reset" disabled={loading}>
              {t('cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {t('save')}
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    );
  }
}
