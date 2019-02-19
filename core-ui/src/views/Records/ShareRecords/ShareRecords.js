// import React, { Component } from 'react';

// class Typography extends Component {
//   render() {
//     return (
//       <div className="animated fadeIn">
//         <div className="card">
//           <div className="card-header">
//             Headings
//           </div>
//           <div className="card-body">
//             <p>Documentation and examples for Bootstrap typography, including global settings, headings, body text, lists, and more.</p>
//             <table className="table">
//               <thead>
//               <tr>
//                 <th>Heading</th>
//                 <th>Example</th>
//               </tr>
//               </thead>
//               <tbody>
//               <tr>
//                 <td>
//                   <p><code className="highlighter-rouge">&lt;h1&gt;&lt;/h1&gt;</code></p>
//                 </td>
//                 <td><span className="h1">h1. Bootstrap heading</span></td>
//               </tr>
//               <tr>
//                 <td>
//                   <p><code className="highlighter-rouge">&lt;h2&gt;&lt;/h2&gt;</code></p>
//                 </td>
//                 <td><span className="h2">h2. Bootstrap heading</span></td>
//               </tr>
//               <tr>
//                 <td>
//                   <p><code className="highlighter-rouge">&lt;h3&gt;&lt;/h3&gt;</code></p>
//                 </td>
//                 <td><span className="h3">h3. Bootstrap heading</span></td>
//               </tr>
//               <tr>
//                 <td>
//                   <p><code className="highlighter-rouge">&lt;h4&gt;&lt;/h4&gt;</code></p>
//                 </td>
//                 <td><span className="h4">h4. Bootstrap heading</span></td>
//               </tr>
//               <tr>
//                 <td>
//                   <p><code className="highlighter-rouge">&lt;h5&gt;&lt;/h5&gt;</code></p>
//                 </td>
//                 <td><span className="h5">h5. Bootstrap heading</span></td>
//               </tr>
//               <tr>
//                 <td>
//                   <p><code className="highlighter-rouge">&lt;h6&gt;&lt;/h6&gt;</code></p>
//                 </td>
//                 <td><span className="h6">h6. Bootstrap heading</span></td>
//               </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-header">
//             Headings
//           </div>
//           <div className="card-body">
//             <p><code className="highlighter-rouge">.h1</code> through <code className="highlighter-rouge">.h6</code> classes are also available, for when you
//               want to match the font styling of a heading but cannot use the associated HTML element.</p>
//             <div className="bd-example">
//               <p className="h1">h1. Bootstrap heading</p>
//               <p className="h2">h2. Bootstrap heading</p>
//               <p className="h3">h3. Bootstrap heading</p>
//               <p className="h4">h4. Bootstrap heading</p>
//               <p className="h5">h5. Bootstrap heading</p>
//               <p className="h6">h6. Bootstrap heading</p>
//             </div>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-header">
//             Display headings
//           </div>
//           <div className="card-body">
//             <p>Traditional heading elements are designed to work best in the meat of your page content. When you need a heading to stand out, consider using
//               a <strong>display heading</strong>—a larger, slightly more opinionated heading style.</p>
//             <div className="bd-example bd-example-type">
//               <table className="table">
//                 <tbody>
//                 <tr>
//                   <td><span className="display-1">Display 1</span></td>
//                 </tr>
//                 <tr>
//                   <td><span className="display-2">Display 2</span></td>
//                 </tr>
//                 <tr>
//                   <td><span className="display-3">Display 3</span></td>
//                 </tr>
//                 <tr>
//                   <td><span className="display-4">Display 4</span></td>
//                 </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-header">
//             Inline text elements
//           </div>
//           <div className="card-body">
//             <p>Traditional heading elements are designed to work best in the meat of your page content. When you need a heading to stand out, consider using
//               a <strong>display heading</strong>—a larger, slightly more opinionated heading style.</p>
//             <div className="bd-example">
//               <p>You can use the mark tag to <mark>highlight</mark> text.</p>
//               <p>
//                 <del>This line of text is meant to be treated as deleted text.</del>
//               </p>
//               <p><s>This line of text is meant to be treated as no longer accurate.</s></p>
//               <p>
//                 <ins>This line of text is meant to be treated as an addition to the document.</ins>
//               </p>
//               <p><u>This line of text will render as underlined</u></p>
//               <p>
//                 <small>This line of text is meant to be treated as fine print.</small>
//               </p>
//               <p><strong>This line rendered as bold text.</strong></p>
//               <p><em>This line rendered as italicized text.</em></p>
//             </div>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-header">
//             Description list alignment
//           </div>
//           <div className="card-body">
//             <p>Align terms and descriptions horizontally by using our grid system’s predefined classes (or semantic mixins). For longer terms, you can
//               optionally add a <code className="highlighter-rouge">.text-truncate</code> class to truncate the text with an ellipsis.</p>
//             <div className="bd-example">
//               <dl className="row">
//                 <dt className="col-sm-3">Description lists</dt>
//                 <dd className="col-sm-9">A description list is perfect for defining terms.</dd>

//                 <dt className="col-sm-3">Euismod</dt>
//                 <dd className="col-sm-9">
//                   <p>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</p>
//                   <p>Donec id elit non mi porta gravida at eget metus.</p>
//                 </dd>

//                 <dt className="col-sm-3">Malesuada porta</dt>
//                 <dd className="col-sm-9">Etiam porta sem malesuada magna mollis euismod.</dd>

//                 <dt className="col-sm-3 text-truncate">Truncated term is truncated</dt>
//                 <dd className="col-sm-9">Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</dd>

//                 <dt className="col-sm-3">Nesting</dt>
//                 <dd className="col-sm-9">
//                   <dl className="row">
//                     <dt className="col-sm-4">Nested definition list</dt>
//                     <dd className="col-sm-8">Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc.</dd>
//                   </dl>
//                 </dd>
//               </dl>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Typography;


import React, { Component } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table
} from "reactstrap";

class ShareRecords extends Component {
  handle = ele => {
    console.log(ele);
    console.log("checkbox");
  };

  createTable = () => {
    let table = [];
    let ids = [];
    // Outer loop to create parent
    // for (let i = 0; i < 3; i++) {
    let children = [
      { id: 0, col1: 0, col2: 0, col3: 0 },
      { id: 1, col1: 1, col2: 2, col3: 3 },
      { id: 2, col1: 2, col2: 4, col3: 6 }
    ];

   
    table.push(
      <tr key={children[0].id}>
        <td>{children[0].col1}</td>
        <td>{children[0].col2}</td>
        <td>{children[0].col3}</td>
        <td></td>
        <td>
          <input
            type="checkbox"
            // defaultChecked={this.state.chkbox}
            id="checkbox0"
            onChange={function() {
              console.log(children[0].id);
              if (document.getElementById("checkbox0").checked) {
                console.log("checked");
                ids.push(children[0].id);
              } else {
                ids = ids.filter(c => {
                  return c !== children[0].id;
                });
              }
              console.log(ids);
            }}
          />
        </td>
      </tr>
    );
    table.push(
      <tr key={children[1].id}>
        <td>{children[1].col1}</td>
        <td>{children[1].col2}</td>
        <td>{children[1].col3}</td>
        <td></td>
        <td>
          <input
            type="checkbox"
            id="checkbox1"
            // defaultChecked={this.state.chkbox}
            onChange={function() {
              console.log(children[1].id);
              if (document.getElementById("checkbox1").checked) {
                console.log("checked");
                ids.push(children[1].id);
              } else {
                ids = ids.filter(c => {
                  return c !== children[1].id;
                });
              }
              console.log(ids);
            }}
          />
        </td>
      </tr>
    );
    table.push(
      <tr key={children[2].id}>
        <td>{children[2].col1}</td>
        <td>{children[2].col2}</td>
        <td>{children[2].col3}</td>
        <td></td>
        <td>
          <input
            type="checkbox"
            id="checkbox2"
            // defaultChecked={this.state.chkbox}
            onChange={function() {
              console.log(children[2].id);
              console.log(document.getElementById("checkbox2").checked);
              if (document.getElementById("checkbox2").checked) {
                console.log("checked");
                ids.push(children[2].id);
              } else {
                ids = ids.filter(c => {
                  return c !== children[2].id;
                });
              }
              console.log(ids);
            }}
          />
        </td>
      </tr>
    );

    
    return table;
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>

          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" /> Share Records
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                  <tr>
                    <th>Record Name</th>
                    <th>Date Generated</th>
                    <th>Record Type</th>
                    <th>Hospital Name</th>
                    <th>Select</th>
                  </tr>
                  </thead>
                    <tbody>
                    {this.createTable()}
         
                  </tbody>
                </Table>
                
              </CardBody>
            </Card>
          </Col>
        </Row>

        
      </div>
    );
  }
}

export default ShareRecords;
