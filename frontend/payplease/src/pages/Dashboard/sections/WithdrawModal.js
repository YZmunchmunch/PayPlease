import React, { useState } from "react";

// PropTypes
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// Material Kit 2 React components
import MKBox from "../../../assets/components/MKBox";
import MKButton from "../../../assets/components/MKButton";
import MKTypography from "../../../assets/components/MKTypography";

// sections
import TransferForm from "./TransferForm";
import MKAlert from "assets/components/MKAlert";

// Session Authentication
import { useAuth } from "context/AuthContext";

export default function WithdrawModal({ setTransferSuccess }) {
  WithdrawModal.propTypes = {
    setTransferSuccess: PropTypes.func.isRequired,
  };
  const [show, setShow] = useState(false);
  const toggleModal = () => setShow(!show);
  const [amount, setAmount] = useState(0);
  const [factor, setFactor] = useState(1);
  const [recipient, setRecipient] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleTopUp = async () => {
    if (user) {
      try {
        const { user_id, token } = user;
        // TODO: Implement send money functionality
        console.log(`Send ${amount} to ${recipient}!`);
        console.log(token);
        const description = null;
        fetch(`/api/transaction/transfer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: amount,
            debit_uid: user_id,
            creditor: recipient,
            description: description,
          }),
        })
          .then((response) => {
            if (response.ok) {
              setTransferSuccess(true);
              setTimeout(() => setTransferSuccess(null), 10000);
              toggleModal();
              return response.json();
            } else {
              return response.json().then((errorData) => {
                throw new Error(errorData.message);
              });
            }
          })
          .then((data) => {
            console.log("Data:", data);
          })
          .catch((error) => {
            console.error("Error transferring:", error);
            setError(error.message);
          });
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here, e.g., display an error message to the user
        setError(error.message);
        setTimeout(() => setError(null), 15000);
      }
    }
  };

  return (
    <MKBox component="section">
      <Container>
        <Grid container item xs={12} justifyContent="center" mx="auto">
          <MKButton variant="gradient" color="primary" size="large" fullWidth onClick={toggleModal}>
            Withdraw
          </MKButton>
        </Grid>
        <Modal open={show} onClose={toggleModal} sx={{ display: "grid", placeItems: "center" }}>
          <Slide direction="up" in={show} timeout={300}>
            <MKBox
              position="relative"
              width="500px"
              display="flex"
              flexDirection="column"
              borderRadius="xl"
              bgColor="white"
              shadow="xl"
            >
              <MKBox display="flex" alignItems="center" justifyContent="space-between" p={2}>
                <MKTypography variant="h5">PayPlease Top Up</MKTypography>
                <CloseIcon fontSize="medium" sx={{ cursor: "pointer" }} onClick={toggleModal} />
              </MKBox>
              <Divider sx={{ my: 0 }} />
              <TransferForm
                amount={amount}
                setAmount={setAmount}
                factor={factor}
                setFactor={setFactor}
                recipient={recipient}
                setRecipient={setRecipient}
              />
              <Divider sx={{ my: 0 }} />
              <MKBox display="flex" justifyContent="space-between" p={1.5}>
                <MKButton variant="gradient" color="dark" onClick={toggleModal}>
                  close
                </MKButton>
                {error && <MKAlert color={"error"}>{error}</MKAlert>}
                <MKButton variant="gradient" color="info" onClick={handleTopUp}>
                  send
                </MKButton>
              </MKBox>
            </MKBox>
          </Slide>
        </Modal>
      </Container>
    </MKBox>
  );
}
