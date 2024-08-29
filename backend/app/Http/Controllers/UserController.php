<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Http\Resources\UsersCollection;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new UsersCollection(User::whereNull('password')->paginate(5));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserCreateRequest $request)
    {
        $data = $request->validated();
        
        if (!empty($request->file('avatar'))) {
            $avatarPath = $request->file('avatar')->store($data['email'], 'public');
            $data['avatar'] = $avatarPath;
        }

        $user = User::create($data);

        return response()->json([
            'message' => 'User created successfully',
            'data' => new UserResource($user)
        ], JsonResponse::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);

        return new UserResource($user); 
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, string $id)
    {
        $user = User::findOrFail($id);
        
        $data = $request->validated();

        if (!empty($request->file('avatar'))) {
            $avatarPath = $request->file('avatar')->store($data['email'], 'public');
            $data['avatar'] = $avatarPath;
        }

        $user->update([
            'name' => \data_get($data, 'name', $user->name),
            'document' => \data_get($data, 'document', $user->document),
            'email' => \data_get($data, 'email', $user->email),
            'phone' => \data_get($data, 'phone', $user->phone),
            'cellphone' => \data_get($data, 'cellphone', $user->cellphone),
            'avatar' => \data_get($data, 'avatar', $user->avatar),
        ]);

        return response()->json([
           'message' => 'User updated successfully',
            'data' => new UserResource($user),
        ], JsonResponse::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        
        $user->delete();

        return response()->json([
           'message' => 'User deleted successfully'
        ], JsonResponse::HTTP_NO_CONTENT);
    }
}
