Rails.application.routes.draw do
  resources :task_categories do
    resources :tasks
  end
  root to: 'welcome#index'
  get '/auth/:provider/callback' => 'sessions#create'
  get '/logout' => 'sessions#destroy', as: :logout

  # API
  namespace :api, { format: 'json' } do
    namespace :v1 do
      resources :task_categories
      resources :tasks
    end
  end
end
