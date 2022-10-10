import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { useState } from "react";
import styles from "./edit.module.css";
import { useAppDispatch } from "../../../../Redux/Store/hooks";
import { IRoom, editRoom } from "../../../../Redux/slice/rooms";
import { beds, services, types, places, rating } from "./constants";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useAppSelector } from "../../../../Redux/Store/hooks";
import { RootState } from "../../../../Redux/Store/store";
import { useParams } from "react-router-dom";
import { getDetailRoom } from "../../../../Redux/slice/rooms";

const Edit = () => {
  const servicesInfo = services;
  const typesInfo = types;
  const bedsInfo = beds;
  const placesInfo = places;
  const ratingInfo = rating;
  const {id} = useParams(); 
  const rooms = useAppSelector((state) => state.rooms.Room);

console.log(id)
console.log(rooms)
  const dispatch = useAppDispatch();

  const idAdmin = useAppSelector((state: RootState) => state.auth.userInfo._id);

  const [openModal, setOpenModal] = useState(false);
  const [input, setInput] = useState<Partial<IRoom>>({
    type: "",
    name: "",
    n_beds: 0,
    price: rooms.price,
    services: [],
    place: "",
    photos: [],
    description: "",
    rating: 0,
  });
  const [validated, setValidated] = useState(false);

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeTextTarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  const handleServicesSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (input.services && !input.services.includes(e.target.value)) {
      setInput({
        ...input,
        services: [...input.services, e.target.value],
      });
    }
  };

  // SECCION CARGAR IMAGENES

  const handlePhotos = (e: ChangeEvent<any>) => {
    const reader: any = new FileReader();
    const file = e.target.files[0];
    const isValidSize = file.size < 5000000;
    const isNameOfOneImageRegEx = /.(jpe?g|gif|png)$/i;
    const isValidType = isNameOfOneImageRegEx.test(file.name);

    if (!isValidSize) {
      return alert("Image size must be smalles than 5mb");
    }
    if (!isValidType) {
      return alert("You just can upload images");
    } else
      reader.onloadend = () =>
        setInput({
          ...input,
          photos: [reader.result],
        });

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent<any>) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
    } else {
      dispatch(editRoom(input));
      setInput({
        type: "",
        place: "",
        n_beds: 0,
        price: 0,
        services: [],
        name: "",
        photos: [],
        description: "",
        rating: 0,
      });
      Swal.fire("Good job!", "Your room was edited!", "success");
    }
  };

  const handleDelete = (e: string) => {
    setInput({
      ...input,
      services: input.services && input.services.filter((el) => el !== e),
    });
  };


  useEffect(() => {
    dispatch(getDetailRoom(id));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainDiv}>
        <div className={styles.title}>Edit your room </div>
        <Form
          onSubmit={handleSubmit}
          className={styles.formDiv}
          noValidate
          validated={validated}
        >
          <FloatingLabel label="Type" className="mb-3">
            <Form.Select
              onChange={handleSelect}
              name="type"
              required
              defaultValue={""}
            >
              <option disabled value={""}>
                {rooms.type}
              </option>
              {typesInfo.map((el) => (
                <option value={el} key={el}>
                  {el}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel label="Place" className="mb-3">
            <Form.Select
              name="place"
              onChange={handleSelect}
              required
              defaultValue={""}
            >
              <option disabled value={""}>
                {rooms.place}
              </option>
              {placesInfo.map((el) => (
                <option value={el} key={el}>
                  {el}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel label={`Name: ${rooms.name}`} className="mb-3">
            <Form.Control
              type="text"
              value={input.name}
              name="name"
              onChange={handleChangeInput}
              required
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a name.
            </Form.Control.Feedback>
          </FloatingLabel>
          <Form.Group className="mb-3">
            <Form.Control
              type="file"
              name="photos"
              onChange={handlePhotos}
              accept=".jpg, .jpeg, .png, .gif"
              required
            />
          </Form.Group>
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>

          <FloatingLabel label="Number of beds" className="mb-3">
            <Form.Select
              name="n_beds"
              onChange={handleSelect}
              defaultValue={""}
            >
              <option disabled value={""}>
                {rooms.n_beds}
              </option>
              {bedsInfo.map((el) => (
                <option value={el} key={el}>
                  {el}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel label="Rating" className="mb-3">
            <Form.Select
              name="rating"
              onChange={handleSelect}
              required
              defaultValue={""}
            >
              <option disabled value={""}>
                {rooms.rating}
              </option>
              {ratingInfo.map((el) => (
                <option value={el} key={el}>
                  {el}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel label="Price" className="mb-3">
            <Form.Control
              value={input.price}
              name="price"
              onChange={handleChangeInput}
              type="number"
              min={"1"}
              max={"1000000"}
              required
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a price.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel label="Services">
            <Form.Select
              onChange={handleServicesSelect}
              required
              defaultValue={""}
            >
              <option disabled value={""}>
                Choose an option
              </option>
              {servicesInfo.map((el) => (
                <option value={el} key={el}>
                  {el}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <Form.Text>Services:</Form.Text>
          <ul className={styles.servicesList}>
            {" "}
            {input.services &&
              input.services.map((el) => (
                <li key={el}>
                  {el}
                  <button
                    onClick={() => handleDelete(el)}
                    className={styles.deleteButton}
                    type="button"
                  >
                    x
                  </button>
                </li>
              ))}
          </ul>

          <Button
            variant="secondary"
            className={styles.descriptionButton}
            onClick={() => handleModal()}
          >
            Description
          </Button>
          <Button type="submit" variant="dark">
            Edit
          </Button>
        </Form>
        <Modal show={openModal} onHide={() => handleModal()}>
          <Modal.Header>
            <Modal.Title>Room description</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            <Form.Control
              as="textarea"
              name="description"
              className={styles.formControl}
              value={input.description}
              onChange={handleChangeTextTarea}
            />
            <Button onClick={() => handleModal()}>Set Description</Button>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Edit;