const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

//This onCreateNode function will be called by Gatsby whenever a new node is created
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    //get the filename from the node and make it to a slug with createFilePath 
    //parent file nodes contain data you need about files on disk
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    //create an additional field on a node created by other plugins
    createNodeField({
      node,
      name: `slug`,
      value: slug
    })
  }
}

/**
 Steps to programmatically creating pages are:

 -Query data with GraphQL
 -Map the query results to pages
 */

//Query data
exports.createPages = async ({ graphql, actions }) => {
  // **Note:** The graphql function call returns a Promise
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  console.log(JSON.stringify(result, null, 4))

  //Map Results to pages
  result.data.allMarkdownRemark.edges.forEach(({node}) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        //Data passed to context is available in page queries as GraphQl variables
        slug: node.fields.slug
      }
    })
  })
}