Rails.application.routes.draw do
  resources :dashboards do
    member do
      put 'priorities' => 'dashboards#update_priorities'
    end
  end
end
