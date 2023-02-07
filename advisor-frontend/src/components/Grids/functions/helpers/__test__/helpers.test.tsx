import * as helpers from "../helpers";

describe("Testing helper function", () => {
  it("initRows should sort on order", () => {
    expect(
      helpers.initRows([
        { id: 2, order: 2, name: "Bruce Wayne" },
        { id: 1, order: 1, name: "Clark Kent" },
      ])
    ).toStrictEqual([
      { id: 1, order: 1, name: "Clark Kent" },
      { id: 2, order: 2, name: "Bruce Wayne" },
    ]);
  });

  it("updateOrderRows should update order based on index", () => {
    expect(
      helpers.updateOrderRows([
        { id: 2, order: 2, name: "Bruce Wayne" },
        { id: 1, order: 1, name: "Clark Kent" },
      ])
    ).toStrictEqual([
      { id: 2, order: 1, name: "Bruce Wayne" },
      { id: 1, order: 2, name: "Clark Kent" },
    ]);
  });

  it("moveRow should move row and update order", () => {
    expect(
      helpers.moveRow(
        [
          { id: 1, order: 1, name: "Bruce Wayne" },
          { id: 2, order: 2, name: "Clark Kent" },
          { id: 3, order: 3, name: "Tony Stark" },
        ],
        { id: 1, order: 1, name: "Bruce Wayne" },
        3
      )
    ).toStrictEqual([
      { id: 2, order: 1, name: "Clark Kent" },
      { id: 3, order: 2, name: "Tony Stark" },
      { id: 1, order: 3, name: "Bruce Wayne" },
    ]);
  });

  it("moveRow should not move row to order below bounds", () => {
    expect(
      helpers.moveRow(
        [
          { id: 1, order: 1, name: "Bruce Wayne" },
          { id: 2, order: 2, name: "Clark Kent" },
          { id: 3, order: 3, name: "Tony Stark" },
        ],
        { id: 1, order: 1, name: "Bruce Wayne" },
        0
      )
    ).toStrictEqual([
      { id: 1, order: 1, name: "Bruce Wayne" },
      { id: 2, order: 2, name: "Clark Kent" },
      { id: 3, order: 3, name: "Tony Stark" },
    ]);
  });

  it("moveRow should not move row to order above bounds", () => {
    expect(
      helpers.moveRow(
        [
          { id: 1, order: 1, name: "Bruce Wayne" },
          { id: 2, order: 2, name: "Clark Kent" },
          { id: 3, order: 3, name: "Tony Stark" },
        ],
        { id: 1, order: 1, name: "Bruce Wayne" },
        4
      )
    ).toStrictEqual([
      { id: 1, order: 1, name: "Bruce Wayne" },
      { id: 2, order: 2, name: "Clark Kent" },
      { id: 3, order: 3, name: "Tony Stark" },
    ]);
  });

  it("updateRow should replace oldRow with newRow", () => {
    expect(
      helpers.updateRow(
        [
          { id: 1, order: 1, name: "Bruce Wayne" },
          { id: 2, order: 2, name: "Clark Kent" },
        ],
        { id: 1, order: 1, name: "Tony Stark" },
        { id: 1, order: 1, name: "Bruce Wayne" }
      )
    ).toStrictEqual([
      { id: 1, order: 1, name: "Tony Stark" },
      { id: 2, order: 2, name: "Clark Kent" },
    ]);
  });

  it("updateRow should replace oldRow with newRow with order", () => {
    expect(
      helpers.updateRow(
        [
          { id: 1, order: 1, name: "Bruce Wayne" },
          { id: 2, order: 2, name: "Clark Kent" },
        ],
        { id: 1, order: 2, name: "Bruce Wayne" },
        { id: 1, order: 1, name: "Bruce Wayne" }
      )
    ).toStrictEqual([
      { id: 2, order: 1, name: "Clark Kent" },
      { id: 1, order: 2, name: "Bruce Wayne" },
    ]);
  });

  it("addRow should add row", () => {
    expect(
      helpers.addRow([{ id: 1, order: 1, name: "Clark Kent" }], {
        id: 2,
        order: 2,
        name: "Bruce Wayne",
      })
    ).toStrictEqual([
      { id: 1, order: 1, name: "Clark Kent" },
      { id: 2, order: 2, name: "Bruce Wayne" },
    ]);
  });

  it("deleteRow should delete row", () => {
    expect(
      helpers.deleteRow(
        [
          { id: 1, order: 1, name: "Clark Kent" },
          { id: 2, order: 2, name: "Bruce Wayne" },
        ],
        {
          id: 2,
          order: 2,
          name: "Bruce Wayne",
        }
      )
    ).toStrictEqual([{ id: 1, order: 1, name: "Clark Kent" }]);
  });
});

it("deleteRow should delete row and update order", () => {
  expect(
    helpers.deleteRow(
      [
        { id: 1, order: 1, name: "Clark Kent" },
        { id: 2, order: 2, name: "Bruce Wayne" },
      ],
      {
        id: 1,
        order: 1,
        name: "Clark Kent",
      }
    )
  ).toStrictEqual([{ id: 2, order: 1, name: "Bruce Wayne" }]);
});
