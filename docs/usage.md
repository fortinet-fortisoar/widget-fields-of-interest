| [Home](../README.md) |
|----------------------|

# Usage

The Fields Of Interest widget displays selected fields in the detailed view of a module with the following additional features:

- Display fields in the detail view of a module record regardless of any visibility constraints

   >For example, a visibility condition on the *Source Port* field of the **Alert** module may display it only if the *Alert Type* is set *Brute Force Attempt*. This widget can still display the *Source Port* field for all alert types.

- Ability to hide or show record fields that are empty.

You can configure this widget separately for each module, i.e., the modification of this widget done for one module is independent of other modules.

## Fields of Interest Widget Views

To add this widget to the detail view of a module record, perform the following steps:

1. Click to open the detailed view of a record, for example an alert.

2. Click **Edit Template** to display its System View Template (SVT).

3. Click **Add Widget** and select the **Fields Of Interest** widget.

4. Use the **Edit Fields of Interest** modal to customize the widget as per your requirements. For more information on the widget fields, refer to the [Fields of Interest Widget Settings](./setup.md#fields-of-interest-widget-settings) section.

   ![](./media/edit-fields-of-interest.png)

   - Enter the `Title` under the **Title (Leave Blank For No Title)** field of this widget

   - Enter the **Row Style**, 
      - if value is added as `display-inline-block` then in detailed view field value will display as below
      ![](./media/detailed-view-inline.png)
      - if leave blank, in detailed view data will be display as below
      ![](./media/detailed-view-no-inline.png)
    
   - Select a column layout under **Layout**. You can select from following options:
      - Single-column structure
      - 2-column structure
      - 3-column structure

   - Select the fields to be added to this widget and click the **Add** button.
   
   - To arrange fields, drag-and-drop them to respective columns.

      - Select the checkbox **Show Field Visibility Checkbox** to display the *Hide Empty Fields* checkbox in detailed view of the module.
      - Select the checkbox **All Inline** to make the fields editable.
      - Select the checkbox **All Read-Only** to display the fields as read-only.

   5. Enable the **Show all Remaining Fields** toggle to include all remaining fields of the module and create a new column called *Others* in the detail view of the record.

   6. Select fields that you want to exclude from the *Others* column from the **Exclude Following Fields** drop-down.

5. Click **Save** to save the changes made to the widget

6. Click **Apply Changes** to add the widget to the detail view of the module's record.

### Fields of Interest Widget View Panel Views

The following image displays the detailed view of an alert record when the **Hide Empty Fields** checkbox is selected.

![](./media/detailed-view-hidden.png)

The following image displays the detailed view of an alert record when the **Hide Empty Fields** checkbox is cleared.

![](./media/detailed-view.png)

| [Installation](./setup.md#installation) | [Configuration](./setup.md#configuration) |
|-----------------------------------------|-------------------------------------------|