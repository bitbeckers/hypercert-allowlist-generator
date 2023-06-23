"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { AllowlistEntry } from "@hypercerts-org/sdk";
import useHypercertsSDK from "../hooks/useHypercertsSDK";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse";

import TextInput from "./TextInput";
import { ControlledNumberInput } from "./ControlledNumberInput";
import { UserAddressInput } from "./UserAddressInput";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  useToast,
  Text,
  Flex,
} from "@chakra-ui/react";

type AllowlistFormProps = {};

type AllowlistFormInputs = {
  name?: string;
  allowlistEntries: AllowlistEntry[];
  totalUnits: number;
};

// React hook form to manualy add an allowlist entry to a dynamic list
const AllowlistForm: React.FC<AllowlistFormProps> = ({}) => {
  const { validator, client } = useHypercertsSDK();
  const formMethods = useForm<AllowlistFormInputs>({
    defaultValues: {
      name: "",
      allowlistEntries: [{ address: "", units: 0 }],
      totalUnits: 0,
    },
  });

  const toast = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const [csv, setCsv] = useState("");
  const [cid, setCid] = useState("");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "allowlistEntries",
  });

  const FileUpload = ({
    onChange,
  }: {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }) => {
    return <Input type="file" onChange={onChange} />;
  };

  const onUploadCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const csvString = reader.result as string;
      parse(csvString, { delimiter: ";", columns: true }, (error, records) => {
        if (error) {
          console.error(error);
          return;
        }
        const allowlistEntries = records.map(
          (rec: {
            id: number;
            address: string;
            price: number;
            fractions: number;
          }) => {
            console.log(rec);
            return {
              address: rec.address,
              units: rec.fractions,
            };
          }
        );
        const totalUnits = allowlistEntries.reduce(
          (
            acc: number,
            entry: {
              address: string;
              units: number;
            }
          ) => acc + Number(entry.units),
          0
        );
        formMethods.setValue("allowlistEntries", allowlistEntries);
        formMethods.setValue("totalUnits", totalUnits);
      });
    };
    reader.readAsText(file);
  };

  const onSubmitForm = (data: AllowlistFormInputs) => {
    console.log(data.allowlistEntries);

    const { valid, errors } = validator.validateAllowlist(
      data.allowlistEntries,
      BigInt(data.totalUnits)
    );
    if (!valid) {
      for (const error in errors) {
        console.log(error);
        toast({
          title: "Error",
          description: errors[error],
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }

      return;
    }

    const csvStringified = generateCsv(data.allowlistEntries);
    setCsv(csvStringified);
  };

  function generateCsv(allowlistEntries: AllowlistEntry[]) {
    const headers = ["index", "address", "price", "fractions"];
    const rows = allowlistEntries.map((entry, index) => [
      index,
      entry.address,
      0.0,
      entry.units,
    ]);

    return stringify([headers, ...rows]);
  }

  const downloadTemplateCsv = async () => {
    const csvStringified =
      "index;address;price;fractions;;;\n0;0x000000000000000000000000000000000000dead;0.0;10000;;;";
    const element = document.createElement("a");
    const file = new Blob([csvStringified], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "allowlistTemplate.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const downloadCsv = () => {
    const element = document.createElement("a");
    const file = new Blob([csv], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "allowlist.csv";
    document.body.appendChild(element);
    element.click();
  };

  const uploadToIPFS = async () => {
    if (!csv) {
      toast({
        title: "Error",
        description: "Please generate a csv first",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Uploading to IPFS",
      description: "Please wait",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

    const cid = await client.storage.storeData(csv);
    console.log(cid);
    setCid(cid);
  };

  return (
    <Flex p={"2em"}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <FormControl>
            <Grid
              templateAreas={`"name totalUnits noinput"
                  "template upload noupload"
                  "allowlist allowlist allowlist"
                  "buttons buttons nobuttons"
                  "cid cid cid"`}
              gap="4"
              color="blackAlpha.700"
              fontWeight="bold"
            >
              <GridItem gridArea="name">
                <FormLabel textColor={"white"}>Allowlist name</FormLabel>

                <TextInput fieldName="name" placeholder="My allowlist" />
              </GridItem>
              <GridItem gridArea="totalUnits">
                <FormLabel textColor={"white"}>
                  Total units of allowlist
                </FormLabel>

                <ControlledNumberInput
                  fieldName="totalUnits"
                  precision={0}
                  min={0}
                  step={1}
                />
              </GridItem>
              <GridItem gridArea="template" maxW={"300px"}>
                <FormLabel textColor={"white"}>Get CSV template</FormLabel>

                <Button onClick={downloadTemplateCsv}>Download template</Button>
              </GridItem>
              <GridItem gridArea="upload" maxW={"300px"}>
                <FormLabel textColor={"white"}>Upload CSV</FormLabel>

                <FileUpload onChange={onUploadCsv} />
              </GridItem>
              <GridItem gridArea="allowlist">
                <Grid templateColumns="repeat(3, 1fr)" gap={6} maxW={"750px"}>
                  <GridItem>
                    <FormLabel textColor={"white"}>Address</FormLabel>
                  </GridItem>
                  <GridItem textColor={"white"}>
                    <FormLabel>Units</FormLabel>
                  </GridItem>
                  <GridItem>{undefined}</GridItem>
                  {fields.map((field, index) => (
                    <>
                      <GridItem key={`${field.id}.${index}.address`}>
                        <UserAddressInput
                          fieldName={`allowlistEntries.${index}.address`}
                          id={field.id}
                        />
                      </GridItem>
                      <GridItem key={`${field.id}.${index}.units`}>
                        <ControlledNumberInput
                          fieldName={`allowlistEntries.${index}.units`}
                          precision={0}
                          min={0}
                          step={1}
                        />
                      </GridItem>
                      <GridItem key={`${field.id}.${index}.remove`}>
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          colorScheme="red"
                        >
                          Remove
                        </Button>
                      </GridItem>
                    </>
                  ))}
                </Grid>
              </GridItem>

              <GridItem gridArea="buttons">
                <ButtonGroup spacing={4}>
                  <Button
                    onClick={() => append({ address: "", units: 0 })}
                    colorScheme="teal"
                  >
                    Add Entry
                  </Button>
                  <Button type="submit" colorScheme="green">
                    Submit
                  </Button>
                  {csv && (
                    <Button
                      type="button"
                      onClick={downloadCsv}
                      colorScheme="blue"
                    >
                      Download CSV
                    </Button>
                  )}
                  {csv && (
                    <Button
                      type="button"
                      onClick={uploadToIPFS}
                      colorScheme="blue"
                    >
                      Upload to IPFS
                    </Button>
                  )}
                </ButtonGroup>
              </GridItem>
              <GridItem gridArea="cid" maxW={"700px"}>
                {cid && (
                  <>
                    <FormLabel textColor={"white"}>
                      CID for last upload
                    </FormLabel>

                    <Text textColor={"white"}>{cid}</Text>
                  </>
                )}
              </GridItem>
            </Grid>
          </FormControl>
        </form>
      </FormProvider>
    </Flex>
  );
};

export default AllowlistForm;
