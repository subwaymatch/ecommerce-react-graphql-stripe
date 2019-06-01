import React, { Component } from "react";
import {
  Container,
  Box,
  Heading,
  Card,
  Text,
  Image,
  SearchField,
  Icon
} from "gestalt";
import { Link } from "react-router-dom";
import "./App.css";
import Strapi from "strapi-sdk-javascript/build/main";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: ""
  };

  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
              brands {
                _id
                name
                description
                image {
                  url
                }
              }
            }`
        }
      });
      this.setState({ brands: response.data.brands });
      console.log(this.state.brands);
    } catch (err) {
      console.error(err);
    }
  }

  handleChange = ({ value }) => {
    this.setState({ searchTerm: value });
  };

  render() {
    const { brands, searchTerm } = this.state;
    return (
      <Container>
        {/* Brands Search Field */}
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="searchField"
            accessibilityLabel="Brands Search Field"
            onChange={this.handleChange}
          />

          <Box margin={2}>
            <Icon icon="filter" color={searchTerm ? "orange" : "gray"} />
          </Box>
        </Box>

        {/* Brands Section */}
        <Box display="flex" justifyContent="around" marginBottom={2}>
          {/* Brands Header */}
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>
        {/* Brands */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6c8ec"
            }
          }}
          shape="rounded"
          wrap
          display="flex"
          justifyContent="around"
        >
          {brands.map(brand => (
            <Box paddingY={4} width={200} margin={2} key={brand._id}>
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image
                      fit="cover"
                      src={`${apiUrl}${brand.image.url}`}
                      alt={brand.name}
                      naturalHeight={1}
                      naturalWidth={1}
                    />
                  </Box>
                }
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  <Text bold size="xl">
                    {brand.name}
                  </Text>
                  <Text>{brand.description}</Text>
                  <Text bold size="xl">
                    <Link to={`/${brand._id}`}>See Brews</Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    );
  }
}

export default App;
