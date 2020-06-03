<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;
use App\Repository\MensajesRepository;
use App\Form\RegistrationFormType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\User;
use App\Entity\Foto;
use App\Entity\Mensajes;
use App\Repository\CiudadRepository;
use App\Repository\PreferenciasRepository;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class AppController extends AbstractController
{
    /**
     * @Route("/home", name="home_user")
     */
    public function home_user(UserRepository $userRepository, CiudadRepository $ciudadRepository): Response
    {
        $user = $this->getUser();
        $arrPhotos = $user->getFoto();
        $photo = $arrPhotos[0]->getNombre();
        $id = $user->getId();
        $urlPhoto = 'users/user'.$id.'/'.$photo;

        return $this->render('app/index.html.twig', [
            'users' => $userRepository->findAll(),
            'nombre' => $ciudadRepository->findAll(),
            'foto' => $urlPhoto
        ]);
    }

    /**
     * @Route("/home/perfil", name="perfil_show", methods={"GET"})
     */
    public function show(): Response
    {
        $user = $this->getUser();
        $preferencias = $user->getPreferencias();
        $fotos = $user->getFoto();
        return $this->render('app/perfil/show.html.twig', [
            'user' => $user,
            'preferencias' => $preferencias,
            'fotos' => $fotos

        ]);
    }
      /**
     * @Route("/panelUser", name="panel_user", options={"expose"=true})
     */
    public function panelUser(UserRepository $userRepository,Request $request)
    {
        $idUserPasivo = $request->get('value');
        $user= $userRepository->find($idUserPasivo);
        
        $userPanel = [
            'Id' => $user->getId(),
            'Nombre' => $user->getNombre(),
            'Ciudad' => $user->getCiudad()->getNombre(),
            'Descripcion' =>$user->getDescripcion()
        ];


        $arrayPref = [];

        foreach ($user->getPreferencias()  as $key => $resultados) {

            if (!in_array($resultados->getNombre(), $arrayPref)) {
                $arrayPref[$key] = $resultados->getNombre();
            }
            $userPanel['Preferencias'] = $arrayPref;
        }

        foreach ($user->getFoto() as $key2 => $resultados2) {
            $arrayFoto = $resultados2->getNombre();
            $userPanel['Foto'] = $arrayFoto;
        }
       
          return new JsonResponse($userPanel);
    }

    /**
     * @Route("/home/perfil/editar", name="perfil_user")
     */
    public function perfil_user(Request $request): Response
    {
        $user = $this->getUser();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $fotoFile =  $form->get('foto')->getData();
            if ($fotoFile != null) {
                $this->getDoctrine()->getManager()->flush();

                self::renamePic($user, $fotoFile);
            } else {
                $this->getDoctrine()->getManager()->flush();
            }

            return $this->redirectToRoute('perfil_show');
        }

        return $this->render('app/perfil/perfil.html.twig', [
            'user' => $user,
            'registrationForm' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="perfil_delete", methods={"DELETE"})
     */
    public function delete(Request $request, User $user, TokenStorageInterface $tokenStorage, SessionInterface $session): Response
    {
        if ($this->isCsrfTokenValid('delete' . $user->getId(), $request->request->get('_token'))) {
            try {
                $directory = 'users/user' . $user->getId();
                if (file_exists($directory)) {
                    self::rrmdir($directory);
                }
            } catch (IOExceptionInterface $exception) {
                echo "An error occurred while creating your directory at " . $exception->getPath();
            }

            $tokenStorage->setToken(null);
            $session->invalidate();

            $entityManager = $this->getDoctrine()->getManager();
            $fotos = $user->getFoto();
            foreach ($fotos as $foto) {
                $entityManager->remove($foto);
            }
            $entityManager->remove($user);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_logout');
    }

    /**
     * @Route("/picUser/{id}", name="perfilPic_delete", methods={"DELETE"})
     */
    public function deletePicture(Request $request, Foto $foto): Response
    {
        $userId = $_POST['idUsuario'];

        $directorio = 'users/user' . $userId;
        $nombreFoto = $directorio . '/' . $foto->getNombre();
        $filesystem = new Filesystem();

        if ($this->isCsrfTokenValid('delete' . $foto->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($foto);
            $entityManager->flush();
            try {
                $filesystem->remove($nombreFoto);
                if (self::is_dir_empty($directorio)) {
                    rmdir($directorio);
                }
            } catch (IOExceptionInterface $exception) {
                echo "An error occurred while creating your directory at " . $exception->getPath();
            }
        }
        return $this->redirectToRoute('perfil_show');
    }

    /**
     * @Route("/home/chat", name="chat", options={"expose"=true})
     */
    public function chat(Request $request, MensajesRepository $mensajeRepository, UserRepository $userRepository): Response
    {

        $idUserPasivo = $request->get('value');
        $idUserActivo = $this->getUser()->getId();

        $enviados = $mensajeRepository->chatSender($idUserActivo, $idUserPasivo);

        foreach ($enviados as $clave => $results) {
            $campo = [
                'Id' => $results->getId(),
                'Mensaje' => $results->getMessage(),
                'Emisor' => $results->getSenderName()->getId(),
                'Receptor' => $results->getRecieverName(),
                'Fecha' => $results->getDate(),
                'usuarioActivo'=> $idUserActivo
            ];
            $enviados[$clave] = $campo;
        }

        return new JsonResponse($enviados);
    }
    /**
     * @Route("/home/search", name="search", options={"expose"=true})
     */
    public function search(Request $request, PreferenciasRepository $preferenciasRepository)
    {
        $busqueda = $request->get('value');
        $preferencias = $preferenciasRepository->buscadorPreferencias($busqueda);
        foreach ($preferencias as $clave => $results) {
            $campo = [
                'Id' => $results->getId(),
                'Nombre' => $results->getNombre(),

            ];
            $preferencias[$clave] = $campo;
        }

        return new JsonResponse($preferencias);
    }

    /**
     * @Route("/home/searchUsers", name="searchUsers", options={"expose"=true})
     */
    public function searchUsers(Request $request, UserRepository $userRepository)
    {
        $idUserActivo = $this->getUser()->getId();
        $ciudad = $request->get('ciudad');
        $gender = $request->get('gender');
        $roomMates = $request->get('roomMates');
        $min = $request->get('min');
        $max = $request->get('max');
        $arrayPreferencias = explode(',', $request->get('preferencias'));

        $resultadosBusqueda = $userRepository->filtradoUsuarios($ciudad, $arrayPreferencias, $gender, $roomMates, $min, $max, $idUserActivo);


        if (!$resultadosBusqueda) {
            $preferencias = "No se han encontrado resultados con esos parámetros";
        } else {
            //foreach ($resultadosBusqueda as $clave => $results) {
            for ($i = 0; $i < count($resultadosBusqueda); $i++) {
                $campo = [
                    'Id' => $resultadosBusqueda[$i]->getId(),
                    'Nombre' => $resultadosBusqueda[$i]->getNombre(),
                    'Apellidos' =>$resultadosBusqueda[$i]->getApellidos(),
                    'Ciudad' => $resultadosBusqueda[$i]->getCiudad()->getNombre(),
                ];


                $arrayPref = [];

                foreach ($resultadosBusqueda[$i]->getPreferencias()  as $key => $resultados) {

                    if (!in_array($resultados->getNombre(), $arrayPref)) {
                        $arrayPref[$key] = $resultados->getNombre();
                    }
                    $campo['Preferencias'] = $arrayPref;
                }

                foreach ($resultadosBusqueda[$i]->getFoto() as $key2 => $resultados2) {
                    $arrayFoto = $resultados2->getNombre();
                    $campo['Foto'] = $arrayFoto;
                }
                $preferencias[$i] = $campo;
            }
        }
        return new JsonResponse($preferencias);
    }
    /**
     * @Route("/home/messageConversation", name="searchConversations", options={"expose"=true})
     */
    public function searchConversation(Request $request, MensajesRepository $mensajeRepository, UserRepository $userRepository)
    {
        $idUserActivo = $this->getUser()->getId();
        $enviados = $mensajeRepository->chatConversation($idUserActivo);
      
        foreach ($enviados as $clave => $objMensaje) {
            if ($objMensaje->getRecieverName()==$idUserActivo){
                $idChat['id'] = $objMensaje->getSenderName();
            }else{
                   $idChat['id'] = $objMensaje->getRecieverName();
            }
         
            $users[$clave] = $userRepository->findBy($idChat);
            
        }
        if (isset($users)) {
            $cont=0;
            $campo=[];
            foreach ($users as $clave => $objUser) {
            if (!in_array($objUser[0]->getId(), $campo)) {
                    $msn = $mensajeRepository->lastMessage($idUserActivo,$objUser[0]->getId());
                    
                $campo = [
                    'Id' => $objUser[0]->getId(),
                    'Nombre' => $objUser[0]->getNombre().' '.$objUser[0]->getApellidos(),
                    'msn'=>$msn[0]->getMessage()
                ];
               
                foreach($objUser[0]->getFoto() as $resultados2){
                    $arrayFoto = $resultados2->getNombre();
                    $campo['Foto'] = $arrayFoto;
                }

                $idUsuarios[$cont] = $campo;
                $cont++;
            }
        
        }
            
        } else {
            $idUsuarios = "No tienes mensajes";
        }

        return new JsonResponse($idUsuarios);
    }
    /**
     * @Route("/home/message", name="sendMessage", options={"expose"=true})
     */
    public function sendMessage(Request $request)
    {
        $idUserPasivo = $request->get('idPasiva');
        $mensajeTexto = $request->get('mensaje');
        $idUserActivo = $this->getUser();

        $hoy = date_create();

        $mensaje = new Mensajes();
        $mensaje->setSenderName($idUserActivo);
        $mensaje->setRecieverName($idUserPasivo);
        $mensaje->setMessage($mensajeTexto);
        $mensaje->setStatus(true);
        $mensaje->setDate($hoy);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($mensaje);
        $entityManager->flush();

        return new JsonResponse();
    }

    private function renamePic(User $user, $fotoFile)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        $foto = new Foto();
        $foto->setNombre($fotoFile->getClientOriginalName());
        $entityManager->persist($foto);
        $entityManager->flush();

        $idFoto = $foto->getId();
        $fileName = 'img' . $user->getId() . '-' . $idFoto . '.' . $fotoFile->guessExtension();

        $filesystem = new Filesystem();
        $filesystem->mkdir('users/user' . $user->getId());

        $fotoFile->move('users/user' . $user->getId(), $fileName);
        $foto->setNombre($fileName);
        $entityManager->flush();

        $user->addFoto($foto);
        $entityManager->flush();
    }

    function is_dir_empty($dir)
    {
        if (!is_readable($dir)) return NULL;
        $handle = opendir($dir);
        while (false !== ($entry = readdir($handle))) {
            if ($entry != "." && $entry != "..") {
                return FALSE;
            }
        }
        return TRUE;
    }

    function rrmdir($src)
    {
        if (file_exists ( $src ) ){
            $dir = opendir($src);
                    while (false !== ($file = readdir($dir))) {
                        if (($file != '.') && ($file != '..')) {
                            $full = $src . '/' . $file;
                            if (is_dir($full)) {
                                rrmdir($full);
                            } else {
                                unlink($full);
                            }
                        }
                    }
                    closedir($dir);
                    rmdir($src);
        }
       
    }
}
