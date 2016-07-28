class CreateDashboards < ActiveRecord::Migration[5.0]
  def change
    create_table :dashboards do |t|
      t.string :query
      t.text :priorities_json

      t.timestamps
    end
  end
end
