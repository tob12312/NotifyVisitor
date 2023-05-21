import { useState } from "react";
import '../styling/NotifyVisitorApp.css';
import {
    FaSistrix
} from "react-icons/fa";
import {
    Container,
    Row,
    Col,
    InputGroup,
    InputGroupText,
    Input,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form,
} from "reactstrap"; 

// Helper Function for returning dropdown with columns to search
const SearchColumn = ({ columns, setSearchBy }) => {

    return (
        <>
            {columns.map((column, index) => (
                <DropdownItem placeholder={column} key={index} onClick={() => {
                    setSearchBy(column)
                }}>{column}
                </DropdownItem>
            ))}
        </>
    )
}

/**
 * Search/ Filter uses by multiple Entities.
 * 
 * returns tool bar with dropdown/ search button and input field.
 * Used to search and filter DB response.
 * 
 * Uses styling elements from Reactstrap.
 * 
 * @param {any} param0
 * @returns
 */
const SearchBar = ({ searchTable, columns }) => {

    const [searchValue, setSearchValue] = useState("");
    const [searchBy, setSearchBy] = useState(columns[0]);

    const submitForm = e => {
        e.preventDefault()
        searchTable(searchValue, searchBy)
    }

    return (
        <div className="search-bar">
            <Container>
                <Row xs="auto">
                    <Col>
                        <UncontrolledDropdown
                            className="Valgmeny">
                            <DropdownToggle style={{ padding: "0px" }}>
                                <Input
                                    className="button-header-with"
                                    placeholder={searchBy}
                                    onChange={e => setSearchBy(e.target.value)} />
                            </DropdownToggle>
                            <DropdownMenu>
                                <SearchColumn
                                    columns={columns}
                                    setSearchBy={setSearchBy}
                                />
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Col>
                    <Col>
                        <Form onSubmit={submitForm}>
                            <InputGroup className="button-header-with">
                                <Input
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Search Value..."
                                    type="text"
                                    name="SearchValue"
                                />
                                <InputGroupText onClick={submitForm}><FaSistrix /></InputGroupText>
                            </InputGroup>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
export default SearchBar