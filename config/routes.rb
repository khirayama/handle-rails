Rails.application.routes.draw do

  namespace :api, { format: 'json' } do
    namespace :v1 do
      resources :task_categories
      put '/task_categories' => 'task_categories#reorder'

      resources :tasks
      put '/tasks' => 'tasks#reorder'

      get '/auth/:provider/callback' => 'sessions#create'
      get '/logout' => 'sessions#destroy'
    end
  end
end
