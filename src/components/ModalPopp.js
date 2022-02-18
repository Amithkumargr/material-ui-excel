import React, { useState } from 'react';
import { styled, Box } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import { Button, Grid, TextField } from '@mui/material';
import TableContent from './Table';
//import XLSX from 'xlsx'
import * as XLSX from "xlsx";



//mui styling
const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: 550,
  bgcolor: 'white',
  border: '1px solid white',
  borderRadius: 2,
  p: 2,
  px: 4,
  pb: 3,
};


const styleText = {
  m: 2
}
const btnMar = {

}


function ModalPopp() {
  const [open, setOpen] = useState(false);
  const [data, setdata] = useState({
    Name: '',
    phone: '',
    email: ''
  })
  const [tableArr, settableArr] = useState([])


  const [toggle, setToggle] = useState(false)
  const [tableId, settableId] = useState(-1)
  const [isNameValid, setisNameValid] = useState(true)
  const [nameError, setnameError] = useState('')
  const [isEmailValid, setisEmailValid] = useState(true)
  const [emailError, setemailError] = useState('')
  const [isPhoneNumberValid, setisPhoneNumberValid] = useState(true)
  const [phoneNumberError, setphoneNumberError] = useState('')

  //opening and closing of modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //to make inputs controled component
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setdata((values) => ({ ...values, [name]: value }))
    console.log(data);
  }

  //download excel function

  const downloadExcel = (data) => {
    console.log(data);
    //Create a worksheet from an array of JS objects
    const workSheet = XLSX.utils.json_to_sheet(data)
    // creating a work book of new from this below line of code
    const workBook = XLSX.utils.book_new()
    //XLSX.utils takes 3 paramter as workbook of new sheet,json worksheet and filename 
    // here we attach the sheet to the workbook
    //XLSX.utils.book_append_sheet(workBook, workSheet, "amith")

    // buffer
    let buffer = XLSX.write(workBook, { bookType: "xlsx", type: "array" })

    //binary string
    //file parts within the zipped package are compressed binary components (. bin) encoded in a proprietary
     //format, instead of being readable XML code. Binary files are optimized for performance and can
     // store anything you can create in Excel.
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

    //writefile from workbook and download

    XLSX.writeFile(workBook, "employeedata.xlsx")


  }


  // --------------------------------------------
  //name validation
  const validateFirstName = (Name) => {
    if (Name) {
      let fName = /^[a-zA-Z ]{2,30}$/;
      //let fName = (/^[a-zA-Z]+$/);
      if (Name.match(fName)) {
        setisNameValid(true)
        setnameError('')
        return true
      } else {
        setisNameValid(false)
        setnameError('*Please enter valid name')
        return false
      }
    } else {
      setisNameValid(false)
      setnameError('*Name cannot be empty')
      return false
    }
  }

  // -------------------------------------------
  //email validation
  const validateEmail = (email) => {
    if (email) {
      let mail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
      if (email.match(mail)) {
        setisEmailValid(true)
        setemailError('')
        return true
      } else {
        setisEmailValid(false)
        setemailError('*Please enter valid email')
        return false
      }
    } else {
      setisEmailValid(false)
      setemailError('*Email cannot be empty')
      return false
    }
  }


  // -----------------------------------------
  //phone number validation
  const validatePhoneNumber = (pnumber) => {
    if (pnumber) {
      let num = /^\d{10}$/;
      if (pnumber.match(num)) {
        setisPhoneNumberValid(true)
        setphoneNumberError('')
        return true
      } else {
        setisPhoneNumberValid(false)
        setphoneNumberError('*Please enter valid phone-number')
        return false
      }
    } else {
      setisPhoneNumberValid(false)
      setphoneNumberError('*Phone-number cannot be empty')
      return false
    }
  }



  const handleSubmit = () => {
    const isNameValid = validateFirstName(data.Name)
    const isEmailValid = validateEmail(data.email)
    const isPhoneNumberValid = validatePhoneNumber(data.phone)
    //for edit 
    if (isNameValid && isPhoneNumberValid && isEmailValid && tableId > -1) {
      var temp = tableArr;
      temp.splice(tableId, 1, data);
      settableArr(temp);
      setToggle(false)
      settableId(-1)
    }
    else if (isNameValid && isPhoneNumberValid && isEmailValid) {
      settableArr([...tableArr, data])  // table array copy and input object is pushing
      setToggle(true)
      setdata({
        Name: '',
        phone: '',
        email: ''
      })
    } else {
      alert('not valid')
      setOpen(true)
    }

  }

  //deleting
  const handleClickDelete
    = (id) => {
      if (id > -1) {
        const updateddata = tableArr.filter((_, index) => {
          return index !== id;
        });
        settableArr(updateddata);
      }
    };

  //editing
  const handleEdit = (id) => {
    setToggle(true);
    setdata(tableArr[id]);
    settableId(id);
    setOpen(true)
  };

  const handleData = () => {
    handleOpen()
    setdata({
      Name: '',
      phone: '',
      email: ''
    })
  }


  return (
    <div>
      <Grid item sx={{ display: "inline" }} ><Button sx={{

        p: 1,
        m: 1,
        bgcolor: 'success',
        maxWidth: 200,
        // justifyContent: 'end',
        borderRadius: 1,
      }} variant={'contained'} type="button"
        onClick={handleData} >
        Employee data
      </Button>




      </Grid>
      <Button variant='contained' color="success" size='large' onClick={() => downloadExcel(tableArr)}>Export to excel</Button>

      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
        <Box sx={style} className='col-7'>
          <h2 id="unstyled-modal-title">{toggle ? 'Edit data' : 'Add data'}</h2>
          <hr />
          {/* <p id="unstyled-modal-description">Aliquid amet deserunt earum!</p> */}
          {/* <Grid item xs={6}> */}
          <div className='col-12 d-inline-flex' >
            <div

            >
              <TextField
                sx={styleText}
                onChange={(e) => handleChange(e)}
                required
                type={'text'}
                id="outlined-required"
                label="Name"
                name='Name'
                value={data.Name}
                placeholder="Enter your name"
              />
              {isNameValid ? null : <p style={{
                color: 'red',
                fontSize: '12px'
              }}>{nameError}</p>}

            </div>

            <div
              className='col-6 d-inline'
            >
              <TextField

                sx={styleText}
                onChange={(e) => handleChange(e)}
                required
                type={'number'}
                id="outlined-required"
                label="Phone No."
                name='phone'
                value={data.phone}

                placeholder="Enter your phone number"
              />
              {isPhoneNumberValid ? null : <p style={{
                color: 'red',
                fontSize: '12px'
              }}>{phoneNumberError}</p>}

            </div>
          </div>

          {/* </Grid> */}

          {/* <Grid item xs={6}> */}

          <div
            className='col-6'
          >
            <TextField
              sx={styleText}
              onChange={(e) => handleChange(e)}
              required
              id="outlined-required"
              label="Email-Id"
              name='email'
              value={data.email}

              placeholder="Enter your email-id"
            />
            {isEmailValid ? null : <p style={{ color: 'red', fontSize: '12px' }}>{emailError}</p>}
          </div>

          {/* </Grid> */}
          <div className='text-center'>
            <Button variant='contained'
              color='success'
              className='m-auto'
              sx={btnMar}
              type={'submit'}
              onClick={(e) => {
                handleClose()
                handleSubmit(e)
              }}
            >{toggle ? 'Submit' : 'Save'}</Button>
          </div>

        </Box>
      </StyledModal>
      <TableContent
        data={tableArr}
        handleClickDelete
        ={handleClickDelete}
        handleEdit={handleEdit}
      //action property
      // action={[
      //   {icon:()=><button >Export</button>,
      //   tooltip:"Export to Excel",
      //   onClick:()=>downloadExcel(data),
      //   isFreeAction:true}
      // ]}
      />
    </div>
  )
}

export default ModalPopp;
export { XLSX }