<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddressCreateRequest;
use App\Http\Requests\AddressUpdateRequest;
use App\Http\Resources\AddressCollection;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $userId)
    {
        $user = User::find($userId); 
        
        return new AddressCollection($user->addresses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AddressCreateRequest $request, string $userId)
    {
        $data = $request->validated();

        $user = User::findOrFail($userId);

        if ($data['main_address']) {
            foreach ($user->addresses as $userAddress) {
                $userAddress->update(['main_address' => false]);
            }
        }

        if ($user->addresses->count() === 0) {
            $data['main_address'] = true;
        }

        $address = $user->addresses()->create($data);

        return response()->json([
            'message' => 'Address created successfully',
            'data' => new AddressResource($address)
        ], JsonResponse::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $address = Address::findOrFail($id);

        return new AddressResource($address);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AddressUpdateRequest $request, string $userId, string $addressId)
    {
        $user = User::findOrFail($userId);

        $address = $user->addresses->find($addressId);

        $data = $request->validated();

        if ($data['main_address']) {
            foreach ($user->addresses as $userAddress) {
                $userAddress->update(['main_address' => false]);
            }
        }

        $address->update([
            'street' => \data_get($data, 'street', $address->street),
            'city' => \data_get($data, 'city', $address->city),
            'state' => \data_get($data,'state', $address->state),
            'zipcode' => \data_get($data, 'zipcode', $address->zipcode),
            'number' => \data_get($data, 'number', $address->number),
            'complement' => \data_get($data, 'complement', $address->complement),
            'district' => \data_get($data, 'district', $address->district),
            'main_address' => \data_get($data,'main_address', $address->main_address),
        ]);

        return response()->json([
           'message' => 'Address updated successfully',
            'data' => new AddressResource($address)
        ], JsonResponse::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $address = Address::findOrFail($id);

        $address->delete();

        return response()->json([
           'message' => 'Address deleted successfully'
        ], JsonResponse::HTTP_NO_CONTENT);
    }
}
