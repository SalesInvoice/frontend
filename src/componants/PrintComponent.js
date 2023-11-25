import React from 'react';

const PrintComponent = React.forwardRef(({ selectedItems, printType }, ref) => (
  <div ref={ref}>
    <table style={{ width: printType === 'POS' ? '50%' : '100%' }}>
      <thead>
        <tr>
          <th>Item Code</th>
          <th>Items Name</th>
          <th>QTY</th>
          <th>VAT%</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {selectedItems.map((item, index) => (
          <tr key={index}>
            <td>{item.itemCode}</td>
            <td>{item.itemEnglishName}</td>
            <td>{item.qty}</td>
            <td>{item.vat}</td>
            <td>{item.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export default PrintComponent;