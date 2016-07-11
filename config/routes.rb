Rails.application.routes.draw do
  resources :task_categories do
    resources :tasks
  end
  root to: 'welcome#index'
  get '/auth/:provider/callback' => 'sessions#create'
  get '/logout' => 'sessions#destroy', as: :logout
end
