Rails.application.routes.draw do

  namespace :api, { format: 'json' } do
    namespace :v1 do
      resources :task_categories
      resources :tasks
      get '/auth/:provider/callback' => 'sessions#create'
      get '/logout' => 'sessions#destroy'
    end
  end
end
